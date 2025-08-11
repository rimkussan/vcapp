import { EntraIdConfig } from '../types';

export function validateConfig(config: EntraIdConfig): void {
  const required = ['clientId', 'clientSecret', 'tenantId', 'redirectUri', 'cookieSecret'];
  
  for (const field of required) {
    if (!config[field as keyof EntraIdConfig]) {
      throw new Error(`Missing required configuration: ${field}`);
    }
  }

  if (config.cookieSecret.length < 32) {
    throw new Error('cookieSecret must be at least 32 characters long');
  }
}

export function getDefaultConfig(): Partial<EntraIdConfig> {
  return {
    scopes: ['openid', 'profile', 'email', 'User.Read'],
    cookieName: 'entraid-session',
    cookieMaxAge: 24 * 60 * 60 * 1000, // 24 hours
    isMultiTenant: false,
  };
}

export function mergeConfig(userConfig: EntraIdConfig): EntraIdConfig {
  const defaults = getDefaultConfig();
  const merged = { ...defaults, ...userConfig };
  validateConfig(merged as EntraIdConfig);
  return merged as EntraIdConfig;
}