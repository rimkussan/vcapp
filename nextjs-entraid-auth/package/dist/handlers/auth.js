"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHandler = void 0;
const server_1 = require("next/server");
const client_1 = require("../utils/client");
const session_1 = require("../utils/session");
const csrf_1 = require("../utils/csrf");
const claims_1 = require("../utils/claims");
const openid_client_1 = require("openid-client");
class AuthHandler {
    constructor(config, claimsMapper) {
        this.config = config;
        this.client = new client_1.EntraIdClient(config);
        this.sessionManager = new session_1.SessionManager(config);
        this.csrfProtection = new csrf_1.CSRFProtection(config.cookieSecret);
        this.claimsMapper = claimsMapper || new claims_1.ClaimsMapper(claims_1.defaultClaimMappings);
    }
    async handleSignIn(request) {
        try {
            if (request.nextUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
                return server_1.NextResponse.json({ error: 'HTTPS required' }, { status: 400 });
            }
            await this.client.initialize();
            const state = openid_client_1.generators.state();
            const codeVerifier = openid_client_1.generators.codeVerifier();
            const nonce = openid_client_1.generators.nonce();
            const csrfToken = this.csrfProtection.generateToken();
            const authUrl = this.client.generateAuthUrl(codeVerifier, state);
            const response = server_1.NextResponse.redirect(authUrl);
            const isSecure = request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production';
            response.cookies.set('oauth_state', state, {
                httpOnly: true,
                secure: isSecure,
                sameSite: 'lax',
                maxAge: 600,
                path: '/'
            });
            response.cookies.set('oauth_code_verifier', codeVerifier, {
                httpOnly: true,
                secure: isSecure,
                sameSite: 'lax',
                maxAge: 600,
                path: '/'
            });
            response.cookies.set('oauth_nonce', nonce, {
                httpOnly: true,
                secure: isSecure,
                sameSite: 'lax',
                maxAge: 600,
                path: '/'
            });
            response.cookies.set('csrf_token', csrfToken, {
                httpOnly: true,
                secure: isSecure,
                sameSite: 'lax',
                maxAge: 3600,
                path: '/'
            });
            return response;
        }
        catch (error) {
            console.error('SignIn error:', error);
            return server_1.NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
        }
    }
    async handleCallback(request) {
        try {
            const { searchParams } = request.nextUrl;
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');
            console.log('Callback received - code:', !!code, 'state:', !!state, 'error:', error);
            if (error) {
                const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                return server_1.NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, baseUrl));
            }
            if (!code || !state) {
                console.log('Missing code or state - code:', !!code, 'state:', !!state);
                return server_1.NextResponse.json({ error: 'Missing authorization code or state' }, { status: 400 });
            }
            const storedState = request.cookies.get('oauth_state')?.value;
            const codeVerifier = request.cookies.get('oauth_code_verifier')?.value;
            console.log('Cookie values - storedState:', !!storedState, 'codeVerifier:', !!codeVerifier);
            console.log('State match:', storedState === state);
            if (!storedState || !codeVerifier || storedState !== state) {
                console.log('State validation failed - stored:', storedState, 'received:', state);
                return server_1.NextResponse.json({ error: 'Invalid state or code verifier' }, { status: 400 });
            }
            await this.client.initialize();
            console.log('About to exchange code for tokens with state:', state);
            const tokenSet = await this.client.exchangeCodeForTokens(code, codeVerifier, state);
            const userInfo = await this.client.getUserInfo(tokenSet.access_token);
            const user = this.claimsMapper.mapUserFromTokens(tokenSet.id_token, userInfo);
            if (this.config.isMultiTenant && this.config.allowedTenants) {
                const userTenantId = user.tenantId;
                if (userTenantId && !this.config.allowedTenants.includes(userTenantId)) {
                    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                    return server_1.NextResponse.redirect(new URL('/?error=tenant_not_allowed', baseUrl));
                }
            }
            const session = {
                user,
                accessToken: tokenSet.access_token,
                refreshToken: tokenSet.refresh_token,
                expiresAt: tokenSet.expires_at ? tokenSet.expires_at * 1000 : Date.now() + 3600000,
                idToken: tokenSet.id_token,
            };
            const sessionToken = await this.sessionManager.createSession(session);
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            const response = server_1.NextResponse.redirect(new URL('/', baseUrl));
            this.sessionManager.setSessionCookie(response, sessionToken);
            response.cookies.set('oauth_state', '', { maxAge: 0 });
            response.cookies.set('oauth_code_verifier', '', { maxAge: 0 });
            response.cookies.set('oauth_nonce', '', { maxAge: 0 });
            return response;
        }
        catch (error) {
            console.error('Callback error:', error);
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            return server_1.NextResponse.redirect(new URL('/?error=authentication_failed', baseUrl));
        }
    }
    async handleSignOut(request) {
        try {
            const session = await this.sessionManager.getSession(request);
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            const response = server_1.NextResponse.redirect(new URL('/', baseUrl));
            this.sessionManager.clearSessionCookie(response);
            if (session?.idToken) {
                const logoutUrl = this.client.getLogoutUrl(session.idToken);
                return server_1.NextResponse.redirect(logoutUrl);
            }
            return response;
        }
        catch (error) {
            console.error('SignOut error:', error);
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            const response = server_1.NextResponse.redirect(new URL('/', baseUrl));
            this.sessionManager.clearSessionCookie(response);
            return response;
        }
    }
    async handleMe(request) {
        try {
            const session = await this.sessionManager.getSession(request);
            if (!session) {
                return server_1.NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }
            if (this.sessionManager.isSessionExpired(session)) {
                return server_1.NextResponse.json({ error: 'Session expired' }, { status: 401 });
            }
            return server_1.NextResponse.json({
                user: session.user,
                expiresAt: new Date(session.expiresAt).toISOString(),
            });
        }
        catch (error) {
            console.error('Me endpoint error:', error);
            return server_1.NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    }
    async handleRefresh(request) {
        try {
            const session = await this.sessionManager.getSession(request);
            if (!session || !session.refreshToken) {
                return server_1.NextResponse.json({ error: 'No refresh token available' }, { status: 401 });
            }
            await this.client.initialize();
            const newTokenSet = await this.client.refreshTokens(session.refreshToken);
            const updatedSession = {
                ...session,
                accessToken: newTokenSet.access_token,
                refreshToken: newTokenSet.refresh_token || session.refreshToken,
                expiresAt: newTokenSet.expires_at ? newTokenSet.expires_at * 1000 : Date.now() + 3600000,
                idToken: newTokenSet.id_token || session.idToken,
            };
            const sessionToken = await this.sessionManager.createSession(updatedSession);
            const response = server_1.NextResponse.json({ success: true });
            this.sessionManager.setSessionCookie(response, sessionToken);
            return response;
        }
        catch (error) {
            console.error('Refresh error:', error);
            const response = server_1.NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
            this.sessionManager.clearSessionCookie(response);
            return response;
        }
    }
    getCSRFToken() {
        return this.csrfProtection.generateToken();
    }
}
exports.AuthHandler = AuthHandler;
