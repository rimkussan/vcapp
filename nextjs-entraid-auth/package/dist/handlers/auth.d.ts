import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig } from '../types';
import { ClaimsMapper } from '../utils/claims';
export declare class AuthHandler {
    private client;
    private sessionManager;
    private csrfProtection;
    private claimsMapper;
    private config;
    constructor(config: EntraIdConfig, claimsMapper?: ClaimsMapper);
    handleSignIn(request: NextRequest): Promise<NextResponse>;
    handleCallback(request: NextRequest): Promise<NextResponse>;
    handleSignOut(request: NextRequest): Promise<NextResponse>;
    handleMe(request: NextRequest): Promise<NextResponse>;
    handleRefresh(request: NextRequest): Promise<NextResponse>;
    getCSRFToken(): string;
}
