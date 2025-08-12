import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig, EntraIdSession } from '../types';
export interface AuthMiddlewareOptions {
    config: EntraIdConfig;
    requireAuth?: boolean;
    requiredRoles?: string[];
    requiredClaims?: Record<string, any>;
    onUnauthorized?: (request: NextRequest) => NextResponse;
    onForbidden?: (request: NextRequest, session: EntraIdSession) => NextResponse;
}
export declare function createAuthMiddleware(options: AuthMiddlewareOptions): (request: NextRequest) => Promise<NextResponse | null>;
