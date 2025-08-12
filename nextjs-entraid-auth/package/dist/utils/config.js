"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
exports.getDefaultConfig = getDefaultConfig;
exports.mergeConfig = mergeConfig;
function validateConfig(config) {
    const required = ['clientId', 'clientSecret', 'tenantId', 'redirectUri', 'cookieSecret'];
    for (const field of required) {
        if (!config[field]) {
            throw new Error(`Missing required configuration: ${field}`);
        }
    }
    if (config.cookieSecret.length < 32) {
        throw new Error('cookieSecret must be at least 32 characters long');
    }
}
function getDefaultConfig() {
    return {
        scopes: ['openid', 'profile', 'email', 'User.Read'],
        cookieName: 'entraid-session',
        cookieMaxAge: 24 * 60 * 60 * 1000, // 24 hours
        isMultiTenant: false,
    };
}
function mergeConfig(userConfig) {
    const defaults = getDefaultConfig();
    const merged = { ...defaults, ...userConfig };
    validateConfig(merged);
    return merged;
}
