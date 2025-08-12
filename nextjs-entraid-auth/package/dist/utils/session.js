"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const jose_1 = require("jose");
class SessionManager {
    constructor(config) {
        this.config = config;
        this.secret = new TextEncoder().encode(config.cookieSecret);
    }
    async createSession(session) {
        const jwt = await new jose_1.SignJWT({ session })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(new Date(session.expiresAt))
            .sign(this.secret);
        return jwt;
    }
    async getSession(request) {
        const cookieName = this.config.cookieName || 'entraid-session';
        const sessionCookie = request.cookies.get(cookieName);
        if (!sessionCookie?.value) {
            return null;
        }
        try {
            const { payload } = await (0, jose_1.jwtVerify)(sessionCookie.value, this.secret);
            const session = payload.session;
            if (!session || Date.now() >= session.expiresAt) {
                return null;
            }
            return session;
        }
        catch (error) {
            return null;
        }
    }
    setSessionCookie(response, sessionToken) {
        const cookieName = this.config.cookieName || 'entraid-session';
        const maxAge = this.config.cookieMaxAge || 24 * 60 * 60 * 1000;
        response.cookies.set(cookieName, sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: maxAge / 1000,
            path: '/',
        });
    }
    clearSessionCookie(response) {
        const cookieName = this.config.cookieName || 'entraid-session';
        response.cookies.set(cookieName, '', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });
    }
    isSessionExpired(session) {
        return Date.now() >= session.expiresAt;
    }
}
exports.SessionManager = SessionManager;
