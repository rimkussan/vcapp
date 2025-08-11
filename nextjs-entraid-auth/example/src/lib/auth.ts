import { createEntraIdAuth, EntraIdConfig } from '@entraid/nextjs-auth';

const config: EntraIdConfig = {
  clientId: process.env.ENTRA_CLIENT_ID!,
  clientSecret: process.env.ENTRA_CLIENT_SECRET!,
  tenantId: process.env.ENTRA_TENANT_ID!,
  redirectUri: process.env.ENTRA_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.ENTRA_POST_LOGOUT_REDIRECT_URI,
  cookieSecret: process.env.ENTRA_COOKIE_SECRET!,
  scopes: process.env.ENTRA_SCOPES?.split(',') || ['openid', 'profile', 'email', 'User.Read'],
  isMultiTenant: process.env.ENTRA_IS_MULTI_TENANT === 'true',
  allowedTenants: process.env.ENTRA_ALLOWED_TENANTS?.split(','),
};

export const auth = createEntraIdAuth({ config });

export default auth;