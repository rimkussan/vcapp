import { EntraIdConfig, TokenSet } from '../types';
export declare class EntraIdClient {
    private client;
    private issuer;
    private config;
    constructor(config: EntraIdConfig);
    initialize(): Promise<void>;
    generateAuthUrl(state?: string): string;
    exchangeCodeForTokens(code: string, codeVerifier: string, state?: string): Promise<TokenSet>;
    refreshTokens(refreshToken: string): Promise<TokenSet>;
    getUserInfo(accessToken: string): Promise<any>;
    getLogoutUrl(idToken?: string): string;
}
