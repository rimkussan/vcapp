import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { EntraIdConfig, EntraIdSession } from '../types';

export class SessionManager {
  private config: EntraIdConfig;
  private secret: Uint8Array;

  constructor(config: EntraIdConfig) {
    this.config = config;
    this.secret = new TextEncoder().encode(config.cookieSecret);
  }

  async createSession(session: EntraIdSession): Promise<string> {
    const jwt = await new SignJWT({ session })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(new Date(session.expiresAt))
      .sign(this.secret);

    return jwt;
  }

  async getSession(request: NextRequest): Promise<EntraIdSession | null> {
    const cookieName = this.config.cookieName || 'entraid-session';
    const sessionCookie = request.cookies.get(cookieName);

    if (!sessionCookie?.value) {
      return null;
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, this.secret);
      const session = payload.session as EntraIdSession;

      if (!session || Date.now() >= session.expiresAt) {
        return null;
      }

      return session;
    } catch (error) {
      return null;
    }
  }

  setSessionCookie(response: NextResponse, sessionToken: string): void {
    const cookieName = this.config.cookieName || 'entraid-session';
    const maxAge = this.config.cookieMaxAge || 24 * 60 * 60 * 1000;

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: maxAge / 1000,
      path: '/',
    });
  }

  clearSessionCookie(response: NextResponse): void {
    const cookieName = this.config.cookieName || 'entraid-session';
    
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
  }

  isSessionExpired(session: EntraIdSession): boolean {
    return Date.now() >= session.expiresAt;
  }
}