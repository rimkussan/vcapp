import { NextRequest, NextResponse } from 'next/server';
import { createAuthMiddleware } from '@entraid/nextjs-auth';

const config = {
  clientId: process.env.ENTRA_CLIENT_ID!,
  clientSecret: process.env.ENTRA_CLIENT_SECRET!,
  tenantId: process.env.ENTRA_TENANT_ID!,
  redirectUri: process.env.ENTRA_REDIRECT_URI!,
  cookieSecret: process.env.ENTRA_COOKIE_SECRET!,
};

const authMiddleware = createAuthMiddleware({
  config,
  requireAuth: false,
  onUnauthorized: (request) => {
    return NextResponse.redirect(new URL('/login', request.url));
  },
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const protectedMiddleware = createAuthMiddleware({
      config,
      requireAuth: true,
      onUnauthorized: (request) => {
        return NextResponse.redirect(new URL('/login', request.url));
      },
    });
    return protectedMiddleware(request);
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminMiddleware = createAuthMiddleware({
      config,
      requireAuth: true,
      requiredRoles: ['Admin'],
      onUnauthorized: (request) => {
        return NextResponse.redirect(new URL('/login', request.url));
      },
      onForbidden: (request) => {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      },
    });
    return adminMiddleware(request);
  }

  return authMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};