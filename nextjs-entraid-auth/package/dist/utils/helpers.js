"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelpers = void 0;
exports.createAuthHelpers = createAuthHelpers;
const session_1 = require("./session");
class AuthHelpers {
    constructor(config) {
        this.config = config;
        this.sessionManager = new session_1.SessionManager(config);
    }
    async getUser(request) {
        const session = await this.getSession(request);
        return session?.user || null;
    }
    async getAccessToken(request) {
        const session = await this.getSession(request);
        if (!session)
            return null;
        if (this.sessionManager.isSessionExpired(session)) {
            return null;
        }
        return session.accessToken;
    }
    async getSession(request) {
        if (request) {
            return await this.sessionManager.getSession(request);
        }
        // Server-side usage requires passing the request object
        if (typeof globalThis.window === 'undefined' && !request) {
            throw new Error('Request object is required for server-side usage');
        }
        return null;
    }
    async isAuthenticated(request) {
        const session = await this.getSession(request);
        return session !== null && !this.sessionManager.isSessionExpired(session);
    }
    async hasRole(role, request) {
        const user = await this.getUser(request);
        return user?.roles?.includes(role) || false;
    }
    async hasAnyRole(roles, request) {
        const user = await this.getUser(request);
        if (!user?.roles)
            return false;
        return roles.some(role => user.roles.includes(role));
    }
    async hasAllRoles(roles, request) {
        const user = await this.getUser(request);
        if (!user?.roles)
            return false;
        return roles.every(role => user.roles.includes(role));
    }
    async hasClaim(claimName, claimValue, request) {
        const user = await this.getUser(request);
        return user?.claims?.[claimName] === claimValue;
    }
    getSignInUrl() {
        return '/api/auth/signin';
    }
    getSignOutUrl() {
        return '/api/auth/signout';
    }
    getCallbackUrl() {
        return '/api/auth/callback';
    }
}
exports.AuthHelpers = AuthHelpers;
function createAuthHelpers(config) {
    return new AuthHelpers(config);
}
