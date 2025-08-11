import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig, EntraIdSession } from '../types';
import { SessionManager } from '../utils/session';
import { CSRFProtection } from '../utils/csrf';

export interface AuthMiddlewareOptions {
  config: EntraIdConfig;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredClaims?: Record<string, any>;
  onUnauthorized?: (request: NextRequest) => NextResponse;
  onForbidden?: (request: NextRequest, session: EntraIdSession) => NextResponse;
}

export function createAuthMiddleware(options: AuthMiddlewareOptions) {
  const sessionManager = new SessionManager(options.config);
  const csrfProtection = new CSRFProtection(options.config.cookieSecret);

  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname;
    
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/auth/')) {
      return null;
    }

    if (request.nextUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(
        new URL(request.url.replace('http:', 'https:')),
        { status: 301 }
      );
    }

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      const csrfToken = csrfProtection.extractTokenFromRequest(request);
      if (!csrfToken || !csrfProtection.validateToken(csrfToken)) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
      }
    }

    const session = await sessionManager.getSession(request);

    if (!options.requireAuth) {
      const response = NextResponse.next();
      if (session) {
        response.headers.set('x-user-authenticated', 'true');
        response.headers.set('x-user-id', session.user.id);
      }
      return response;
    }

    if (!session) {
      if (options.onUnauthorized) {
        return options.onUnauthorized(request);
      }
      return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    if (sessionManager.isSessionExpired(session)) {
      const response = NextResponse.redirect(new URL('/api/auth/signin', request.url));
      sessionManager.clearSessionCookie(response);
      return response;
    }

    if (options.requiredRoles && options.requiredRoles.length > 0) {
      const userRoles = session.user.roles || [];
      const hasRequiredRole = options.requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        if (options.onForbidden) {
          return options.onForbidden(request, session);
        }
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    if (options.requiredClaims) {
      const userClaims = session.user.claims || {};
      const hasRequiredClaims = Object.entries(options.requiredClaims).every(
        ([key, value]) => userClaims[key] === value
      );

      if (!hasRequiredClaims) {
        if (options.onForbidden) {
          return options.onForbidden(request, session);
        }
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    const response = NextResponse.next();
    response.headers.set('x-user-authenticated', 'true');
    response.headers.set('x-user-id', session.user.id);
    
    return response;
  };
}