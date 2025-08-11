import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { EntraIdConfig, EntraIdSession, EntraIdUser } from '../types';
import { SessionManager } from './session';

export class AuthHelpers {
  private sessionManager: SessionManager;
  private config: EntraIdConfig;

  constructor(config: EntraIdConfig) {
    this.config = config;
    this.sessionManager = new SessionManager(config);
  }

  async getUser(request?: NextRequest): Promise<EntraIdUser | null> {
    const session = await this.getSession(request);
    return session?.user || null;
  }

  async getAccessToken(request?: NextRequest): Promise<string | null> {
    const session = await this.getSession(request);
    
    if (!session) return null;
    
    if (this.sessionManager.isSessionExpired(session)) {
      return null;
    }

    return session.accessToken;
  }

  async getSession(request?: NextRequest): Promise<EntraIdSession | null> {
    if (request) {
      return await this.sessionManager.getSession(request);
    }

    if (typeof window === 'undefined') {
      const headersList = headers();
      const mockRequest = {
        cookies: {
          get: (name: string) => {
            const cookie = headersList.get('cookie')?.split(';')
              .find(c => c.trim().startsWith(`${name}=`));
            return cookie ? { value: cookie.split('=')[1] } : undefined;
          }
        }
      } as unknown as NextRequest;

      return await this.sessionManager.getSession(mockRequest);
    }

    return null;
  }

  async isAuthenticated(request?: NextRequest): Promise<boolean> {
    const session = await this.getSession(request);
    return session !== null && !this.sessionManager.isSessionExpired(session);
  }

  async hasRole(role: string, request?: NextRequest): Promise<boolean> {
    const user = await this.getUser(request);
    return user?.roles?.includes(role) || false;
  }

  async hasAnyRole(roles: string[], request?: NextRequest): Promise<boolean> {
    const user = await this.getUser(request);
    if (!user?.roles) return false;
    return roles.some(role => user.roles!.includes(role));
  }

  async hasAllRoles(roles: string[], request?: NextRequest): Promise<boolean> {
    const user = await this.getUser(request);
    if (!user?.roles) return false;
    return roles.every(role => user.roles!.includes(role));
  }

  async hasClaim(claimName: string, claimValue: any, request?: NextRequest): Promise<boolean> {
    const user = await this.getUser(request);
    return user?.claims?.[claimName] === claimValue;
  }

  getSignInUrl(): string {
    return '/api/auth/signin';
  }

  getSignOutUrl(): string {
    return '/api/auth/signout';
  }

  getCallbackUrl(): string {
    return '/api/auth/callback';
  }
}

export function createAuthHelpers(config: EntraIdConfig): AuthHelpers {
  return new AuthHelpers(config);
}