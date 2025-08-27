export { EntraIdConfig, EntraIdUser, EntraIdSession, AuthResult, TokenSet, AuthError } from './types';

export { validateConfig, getDefaultConfig, mergeConfig } from './utils/config';
export { EntraIdClient } from './utils/client';
export { SessionManager } from './utils/session';
export { CSRFProtection } from './utils/csrf';
export { AuthHelpers, createAuthHelpers } from './utils/helpers';
export { 
  ClaimsMapper, 
  defaultClaimMappings, 
  ClaimMapping, 
  RoleMapping 
} from './utils/claims';

export { createAuthMiddleware, AuthMiddlewareOptions } from './middleware/auth';
export { AuthHandler } from './handlers/auth';

import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig } from './types';
import { AuthHandler } from './handlers/auth';
import { createAuthHelpers } from './utils/helpers';
import { mergeConfig } from './utils/config';
import { ClaimsMapper, defaultClaimMappings } from './utils/claims';

export interface EntraIdAuthOptions {
  config: EntraIdConfig;
  claimsMapper?: ClaimsMapper;
}

export class EntraIdAuth {
  private authHandler: AuthHandler;
  private helpers: ReturnType<typeof createAuthHelpers>;
  private config: EntraIdConfig;

  constructor(options: EntraIdAuthOptions) {
    this.config = mergeConfig(options.config);
    const claimsMapper = options.claimsMapper || new ClaimsMapper(defaultClaimMappings);
    
    this.authHandler = new AuthHandler(this.config, claimsMapper);
    this.helpers = createAuthHelpers(this.config);
  }

  get auth() {
    return this.helpers;
  }

  async handleAuth(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    
    // Extract the action from the pathname (handles both exact paths and dynamic routes)
    // For dynamic routes like /api/auth/[...auth], extract the first segment after /api/auth/
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    let action = '';
    
    if (pathSegments.length >= 3 && pathSegments[0] === 'api' && pathSegments[1] === 'auth') {
      action = pathSegments[2];
    } else {
      // Fallback for exact path matching
      const actionMatch = pathname.match(/^\/api\/auth\/(.+?)(?:\/|$)/);
      if (actionMatch) {
        action = actionMatch[1];
      }
    }
    
    switch (action) {
      case 'signin':
        return await this.authHandler.handleSignIn(request);
      case 'callback':
        return await this.authHandler.handleCallback(request);
      case 'signout':
        return await this.authHandler.handleSignOut(request);
      case 'me':
        return await this.authHandler.handleMe(request);
      case 'refresh':
        return await this.authHandler.handleRefresh(request);
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  generateCSRFToken(): string {
    return this.authHandler.getCSRFToken();
  }
}

export function createEntraIdAuth(options: EntraIdAuthOptions): EntraIdAuth {
  return new EntraIdAuth(options);
}

export function withAuth<T extends (...args: any[]) => any>(
  handler: T,
  config: EntraIdConfig,
  options?: {
    requireAuth?: boolean;
    requiredRoles?: string[];
    requiredClaims?: Record<string, any>;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const request = args[0] as NextRequest;
    const helpers = createAuthHelpers(config);

    if (options?.requireAuth !== false) {
      const isAuthenticated = await helpers.isAuthenticated(request);
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (options?.requiredRoles) {
      const hasRole = await helpers.hasAnyRole(options.requiredRoles, request);
      if (!hasRole) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (options?.requiredClaims) {
      const user = await helpers.getUser(request);
      const hasRequiredClaims = Object.entries(options.requiredClaims).every(
        ([key, value]) => user?.claims?.[key] === value
      );
      if (!hasRequiredClaims) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return handler(...args);
  }) as T;
}

export default EntraIdAuth;