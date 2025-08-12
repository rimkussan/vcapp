import { NextRequest } from 'next/server';
export declare class CSRFProtection {
    private secret;
    constructor(secret: string);
    generateToken(): string;
    validateToken(token: string, maxAge?: number): boolean;
    extractTokenFromRequest(request: NextRequest): string | null;
}
