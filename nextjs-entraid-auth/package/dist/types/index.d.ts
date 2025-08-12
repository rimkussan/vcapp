export interface EntraIdConfig {
    clientId: string;
    clientSecret: string;
    tenantId: string;
    redirectUri: string;
    postLogoutRedirectUri?: string;
    scopes?: string[];
    cookieSecret: string;
    cookieName?: string;
    cookieMaxAge?: number;
    isMultiTenant?: boolean;
    allowedTenants?: string[];
}
export interface EntraIdUser {
    id: string;
    email: string;
    name: string;
    preferredUsername?: string;
    roles?: string[];
    claims?: Record<string, any>;
    tenantId?: string;
}
export interface EntraIdSession {
    user: EntraIdUser;
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    idToken?: string;
}
export interface AuthResult {
    user: EntraIdUser;
    session: EntraIdSession;
}
export interface TokenSet {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_at?: number;
    token_type: string;
    scope?: string;
}
export interface AuthError extends Error {
    code?: string;
    description?: string;
}
