import { NextRequest } from 'next/server';
import { EntraIdConfig, EntraIdSession, EntraIdUser } from '../types';
export declare class AuthHelpers {
    private sessionManager;
    private config;
    constructor(config: EntraIdConfig);
    getUser(request?: NextRequest): Promise<EntraIdUser | null>;
    getAccessToken(request?: NextRequest): Promise<string | null>;
    getSession(request?: NextRequest): Promise<EntraIdSession | null>;
    isAuthenticated(request?: NextRequest): Promise<boolean>;
    hasRole(role: string, request?: NextRequest): Promise<boolean>;
    hasAnyRole(roles: string[], request?: NextRequest): Promise<boolean>;
    hasAllRoles(roles: string[], request?: NextRequest): Promise<boolean>;
    hasClaim(claimName: string, claimValue: any, request?: NextRequest): Promise<boolean>;
    getSignInUrl(): string;
    getSignOutUrl(): string;
    getCallbackUrl(): string;
}
export declare function createAuthHelpers(config: EntraIdConfig): AuthHelpers;
