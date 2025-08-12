export { EntraIdConfig, EntraIdUser, EntraIdSession, AuthResult, TokenSet, AuthError } from './types';
export { validateConfig, getDefaultConfig, mergeConfig } from './utils/config';
export { EntraIdClient } from './utils/client';
export { SessionManager } from './utils/session';
export { CSRFProtection } from './utils/csrf';
export { AuthHelpers, createAuthHelpers } from './utils/helpers';
export { ClaimsMapper, defaultClaimMappings, ClaimMapping, RoleMapping } from './utils/claims';
export { createAuthMiddleware, AuthMiddlewareOptions } from './middleware/auth';
export { AuthHandler } from './handlers/auth';
import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig } from './types';
import { ClaimsMapper } from './utils/claims';
export interface EntraIdAuthOptions {
    config: EntraIdConfig;
    claimsMapper?: ClaimsMapper;
}
export declare class EntraIdAuth {
    private authHandler;
    private helpers;
    private config;
    constructor(options: EntraIdAuthOptions);
    get auth(): import("./utils/helpers").AuthHelpers;
    handleAuth(request: NextRequest): Promise<NextResponse>;
    generateCSRFToken(): string;
}
export declare function createEntraIdAuth(options: EntraIdAuthOptions): EntraIdAuth;
export declare function withAuth<T extends (...args: any[]) => any>(handler: T, config: EntraIdConfig, options?: {
    requireAuth?: boolean;
    requiredRoles?: string[];
    requiredClaims?: Record<string, any>;
}): T;
export default EntraIdAuth;
