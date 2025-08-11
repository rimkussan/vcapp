import { NextRequest, NextResponse } from 'next/server';
import { EntraIdConfig, EntraIdSession, TokenSet } from '../types';
import { EntraIdClient } from '../utils/client';
import { SessionManager } from '../utils/session';
import { CSRFProtection } from '../utils/csrf';
import { ClaimsMapper, defaultClaimMappings } from '../utils/claims';
import { generators } from 'openid-client';

export class AuthHandler {
  private client: EntraIdClient;
  private sessionManager: SessionManager;
  private csrfProtection: CSRFProtection;
  private claimsMapper: ClaimsMapper;
  private config: EntraIdConfig;

  constructor(config: EntraIdConfig, claimsMapper?: ClaimsMapper) {
    this.config = config;
    this.client = new EntraIdClient(config);
    this.sessionManager = new SessionManager(config);
    this.csrfProtection = new CSRFProtection(config.cookieSecret);
    this.claimsMapper = claimsMapper || new ClaimsMapper(defaultClaimMappings);
  }

  async handleSignIn(request: NextRequest): Promise<NextResponse> {
    try {
      if (request.nextUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'HTTPS required' }, { status: 400 });
      }

      await this.client.initialize();

      const state = generators.state();
      const codeVerifier = generators.codeVerifier();
      const nonce = generators.nonce();
      const csrfToken = this.csrfProtection.generateToken();

      const authUrl = this.client.generateAuthUrl(state);

      const response = NextResponse.redirect(authUrl);

      response.cookies.set('oauth_state', state, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 600,
        path: '/'
      });

      response.cookies.set('oauth_code_verifier', codeVerifier, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 600,
        path: '/'
      });

      response.cookies.set('oauth_nonce', nonce, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 600,
        path: '/'
      });

      response.cookies.set('csrf_token', csrfToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600,
        path: '/'
      });

      return response;
    } catch (error) {
      console.error('SignIn error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
  }

  async handleCallback(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = request.nextUrl;
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
      }

      if (!code || !state) {
        return NextResponse.json({ error: 'Missing authorization code or state' }, { status: 400 });
      }

      const storedState = request.cookies.get('oauth_state')?.value;
      const codeVerifier = request.cookies.get('oauth_code_verifier')?.value;

      if (!storedState || !codeVerifier || storedState !== state) {
        return NextResponse.json({ error: 'Invalid state or code verifier' }, { status: 400 });
      }

      await this.client.initialize();

      const tokenSet: TokenSet = await this.client.exchangeCodeForTokens(code, codeVerifier, state);

      const userInfo = await this.client.getUserInfo(tokenSet.access_token);
      const user = this.claimsMapper.mapUserFromTokens(tokenSet.id_token!, userInfo);

      if (this.config.isMultiTenant && this.config.allowedTenants) {
        const userTenantId = user.tenantId;
        if (userTenantId && !this.config.allowedTenants.includes(userTenantId)) {
          return NextResponse.redirect(new URL('/?error=tenant_not_allowed', request.url));
        }
      }

      const session: EntraIdSession = {
        user,
        accessToken: tokenSet.access_token,
        refreshToken: tokenSet.refresh_token,
        expiresAt: tokenSet.expires_at ? tokenSet.expires_at * 1000 : Date.now() + 3600000,
        idToken: tokenSet.id_token,
      };

      const sessionToken = await this.sessionManager.createSession(session);

      const response = NextResponse.redirect(new URL('/', request.url));
      this.sessionManager.setSessionCookie(response, sessionToken);

      response.cookies.set('oauth_state', '', { maxAge: 0 });
      response.cookies.set('oauth_code_verifier', '', { maxAge: 0 });
      response.cookies.set('oauth_nonce', '', { maxAge: 0 });

      return response;
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(new URL('/?error=authentication_failed', request.url));
    }
  }

  async handleSignOut(request: NextRequest): Promise<NextResponse> {
    try {
      const session = await this.sessionManager.getSession(request);
      
      const response = NextResponse.redirect(new URL('/', request.url));
      this.sessionManager.clearSessionCookie(response);

      if (session?.idToken) {
        const logoutUrl = this.client.getLogoutUrl(session.idToken);
        return NextResponse.redirect(logoutUrl);
      }

      return response;
    } catch (error) {
      console.error('SignOut error:', error);
      const response = NextResponse.redirect(new URL('/', request.url));
      this.sessionManager.clearSessionCookie(response);
      return response;
    }
  }

  async handleMe(request: NextRequest): Promise<NextResponse> {
    try {
      const session = await this.sessionManager.getSession(request);

      if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }

      if (this.sessionManager.isSessionExpired(session)) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }

      return NextResponse.json({
        user: session.user,
        expiresAt: new Date(session.expiresAt).toISOString(),
      });
    } catch (error) {
      console.error('Me endpoint error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  async handleRefresh(request: NextRequest): Promise<NextResponse> {
    try {
      const session = await this.sessionManager.getSession(request);

      if (!session || !session.refreshToken) {
        return NextResponse.json({ error: 'No refresh token available' }, { status: 401 });
      }

      await this.client.initialize();

      const newTokenSet = await this.client.refreshTokens(session.refreshToken);

      const updatedSession: EntraIdSession = {
        ...session,
        accessToken: newTokenSet.access_token,
        refreshToken: newTokenSet.refresh_token || session.refreshToken,
        expiresAt: newTokenSet.expires_at ? newTokenSet.expires_at * 1000 : Date.now() + 3600000,
        idToken: newTokenSet.id_token || session.idToken,
      };

      const sessionToken = await this.sessionManager.createSession(updatedSession);

      const response = NextResponse.json({ success: true });
      this.sessionManager.setSessionCookie(response, sessionToken);

      return response;
    } catch (error) {
      console.error('Refresh error:', error);
      const response = NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
      this.sessionManager.clearSessionCookie(response);
      return response;
    }
  }

  getCSRFToken(): string {
    return this.csrfProtection.generateToken();
  }
}