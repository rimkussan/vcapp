import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);
  
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next();
  }
  
  // Check authentication for protected routes
  if (
    request.nextUrl.pathname.startsWith('/protected') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Redirect to home if not authenticated
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};