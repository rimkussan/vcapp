import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig, EntraIdSession } from '../types';
export declare class SessionManager {
    private config;
    private secret;
    constructor(config: EntraIdConfig);
    createSession(session: EntraIdSession): Promise<string>;
    getSession(request: NextRequest): Promise<EntraIdSession | null>;
    setSessionCookie(response: NextResponse, sessionToken: string): void;
    clearSessionCookie(response: NextResponse): void;
    isSessionExpired(session: EntraIdSession): boolean;
}
