"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntraIdAuth = exports.AuthHandler = exports.createAuthMiddleware = exports.defaultClaimMappings = exports.ClaimsMapper = exports.createAuthHelpers = exports.AuthHelpers = exports.CSRFProtection = exports.SessionManager = exports.EntraIdClient = exports.mergeConfig = exports.getDefaultConfig = exports.validateConfig = void 0;
exports.createEntraIdAuth = createEntraIdAuth;
exports.withAuth = withAuth;
var config_1 = require("./utils/config");
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return config_1.validateConfig; } });
Object.defineProperty(exports, "getDefaultConfig", { enumerable: true, get: function () { return config_1.getDefaultConfig; } });
Object.defineProperty(exports, "mergeConfig", { enumerable: true, get: function () { return config_1.mergeConfig; } });
var client_1 = require("./utils/client");
Object.defineProperty(exports, "EntraIdClient", { enumerable: true, get: function () { return client_1.EntraIdClient; } });
var session_1 = require("./utils/session");
Object.defineProperty(exports, "SessionManager", { enumerable: true, get: function () { return session_1.SessionManager; } });
var csrf_1 = require("./utils/csrf");
Object.defineProperty(exports, "CSRFProtection", { enumerable: true, get: function () { return csrf_1.CSRFProtection; } });
var helpers_1 = require("./utils/helpers");
Object.defineProperty(exports, "AuthHelpers", { enumerable: true, get: function () { return helpers_1.AuthHelpers; } });
Object.defineProperty(exports, "createAuthHelpers", { enumerable: true, get: function () { return helpers_1.createAuthHelpers; } });
var claims_1 = require("./utils/claims");
Object.defineProperty(exports, "ClaimsMapper", { enumerable: true, get: function () { return claims_1.ClaimsMapper; } });
Object.defineProperty(exports, "defaultClaimMappings", { enumerable: true, get: function () { return claims_1.defaultClaimMappings; } });
var auth_1 = require("./middleware/auth");
Object.defineProperty(exports, "createAuthMiddleware", { enumerable: true, get: function () { return auth_1.createAuthMiddleware; } });
var auth_2 = require("./handlers/auth");
Object.defineProperty(exports, "AuthHandler", { enumerable: true, get: function () { return auth_2.AuthHandler; } });
const server_1 = require("next/server");
const auth_3 = require("./handlers/auth");
const helpers_2 = require("./utils/helpers");
const config_2 = require("./utils/config");
const claims_2 = require("./utils/claims");
class EntraIdAuth {
    constructor(options) {
        this.config = (0, config_2.mergeConfig)(options.config);
        const claimsMapper = options.claimsMapper || new claims_2.ClaimsMapper(claims_2.defaultClaimMappings);
        this.authHandler = new auth_3.AuthHandler(this.config, claimsMapper);
        this.helpers = (0, helpers_2.createAuthHelpers)(this.config);
    }
    get auth() {
        return this.helpers;
    }
    async handleAuth(request) {
        const { pathname } = request.nextUrl;
        // Extract the action from the pathname (handles both exact paths and dynamic routes)
        // For dynamic routes like /api/auth/[...auth], extract the first segment after /api/auth/
        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        let action = '';
        if (pathSegments.length >= 3 && pathSegments[0] === 'api' && pathSegments[1] === 'auth') {
            action = pathSegments[2];
        }
        else {
            // Fallback for exact path matching
            const actionMatch = pathname.match(/^\/api\/auth\/(.+?)(?:\/|$)/);
            if (actionMatch) {
                action = actionMatch[1];
            }
        }
        switch (action) {
            case 'signin':
                return await this.authHandler.handleSignIn(request);
            case 'callback':
                return await this.authHandler.handleCallback(request);
            case 'signout':
                return await this.authHandler.handleSignOut(request);
            case 'me':
                return await this.authHandler.handleMe(request);
            case 'refresh':
                return await this.authHandler.handleRefresh(request);
            default:
                return server_1.NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
    }
    generateCSRFToken() {
        return this.authHandler.getCSRFToken();
    }
}
exports.EntraIdAuth = EntraIdAuth;
function createEntraIdAuth(options) {
    return new EntraIdAuth(options);
}
function withAuth(handler, config, options) {
    return (async (...args) => {
        const request = args[0];
        const helpers = (0, helpers_2.createAuthHelpers)(config);
        if (options?.requireAuth !== false) {
            const isAuthenticated = await helpers.isAuthenticated(request);
            if (!isAuthenticated) {
                return server_1.NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }
        if (options?.requiredRoles) {
            const hasRole = await helpers.hasAnyRole(options.requiredRoles, request);
            if (!hasRole) {
                return server_1.NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }
        if (options?.requiredClaims) {
            const user = await helpers.getUser(request);
            const hasRequiredClaims = Object.entries(options.requiredClaims).every(([key, value]) => user?.claims?.[key] === value);
            if (!hasRequiredClaims) {
                return server_1.NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }
        return handler(...args);
    });
}
exports.default = EntraIdAuth;
