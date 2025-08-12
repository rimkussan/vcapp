import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simplified middleware for testing - just allow all requests for now
  console.log('Middleware called for:', request.nextUrl.pathname);
  
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};