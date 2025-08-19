import { Client, Issuer, generators } from 'openid-client';
import { EntraIdConfig, TokenSet } from '../types';

export class EntraIdClient {
  private client: Client | null = null;
  private issuer: Issuer<Client> | null = null;
  private config: EntraIdConfig;

  constructor(config: EntraIdConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.client) return;

    const issuerUrl = this.config.isMultiTenant
      ? `https://login.microsoftonline.com/common/v2.0`
      : `https://login.microsoftonline.com/${this.config.tenantId}/v2.0`;

    this.issuer = await Issuer.discover(issuerUrl);
    
    this.client = new this.issuer.Client({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uris: [this.config.redirectUri],
      response_types: ['code'],
    });
  }

  generateAuthUrl(codeVerifier: string, state?: string): string {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const codeChallenge = generators.codeChallenge(codeVerifier);

    const authUrl = this.client.authorizationUrl({
      scope: this.config.scopes?.join(' ') || 'openid profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    return authUrl;
  }

  async exchangeCodeForTokens(code: string, codeVerifier: string, state?: string): Promise<TokenSet> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    console.log('exchangeCodeForTokens called with:', {
      code: !!code,
      codeVerifier: !!codeVerifier,
      state: !!state,
      redirectUri: this.config.redirectUri
    });

    const params = { code };
    if (state) {
      (params as any).state = state;
    }

    console.log('Calling client.callback with params:', params);

    const tokenSet = await this.client.callback(
      this.config.redirectUri,
      params,
      { code_verifier: codeVerifier }
    );

    return {
      access_token: tokenSet.access_token!,
      refresh_token: tokenSet.refresh_token,
      id_token: tokenSet.id_token,
      expires_at: tokenSet.expires_at,
      token_type: tokenSet.token_type!,
      scope: tokenSet.scope,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenSet> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const tokenSet = await this.client.refresh(refreshToken);

    return {
      access_token: tokenSet.access_token!,
      refresh_token: tokenSet.refresh_token || refreshToken,
      id_token: tokenSet.id_token,
      expires_at: tokenSet.expires_at,
      token_type: tokenSet.token_type!,
      scope: tokenSet.scope,
    };
  }

  async getUserInfo(accessToken: string): Promise<any> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    return await this.client.userinfo(accessToken);
  }

  getLogoutUrl(idToken?: string): string {
    const logoutUrl = this.config.isMultiTenant
      ? 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
      : `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/logout`;

    const params = new URLSearchParams();
    if (this.config.postLogoutRedirectUri) {
      params.set('post_logout_redirect_uri', this.config.postLogoutRedirectUri);
    }
    if (idToken) {
      params.set('id_token_hint', idToken);
    }

    return `${logoutUrl}?${params.toString()}`;
  }
}