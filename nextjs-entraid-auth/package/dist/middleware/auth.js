"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = createAuthMiddleware;
const server_1 = require("next/server");
const session_1 = require("../utils/session");
const csrf_1 = require("../utils/csrf");
function createAuthMiddleware(options) {
    const sessionManager = new session_1.SessionManager(options.config);
    const csrfProtection = new csrf_1.CSRFProtection(options.config.cookieSecret);
    return async function authMiddleware(request) {
        const pathname = request.nextUrl.pathname;
        if (pathname.startsWith('/_next/') || pathname.startsWith('/api/auth/')) {
            return null;
        }
        if (request.nextUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            return server_1.NextResponse.redirect(new URL(request.url.replace('http:', 'https:')), { status: 301 });
        }
        if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
            const csrfToken = csrfProtection.extractTokenFromRequest(request);
            if (!csrfToken || !csrfProtection.validateToken(csrfToken)) {
                return server_1.NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
            }
        }
        const session = await sessionManager.getSession(request);
        if (!options.requireAuth) {
            const response = server_1.NextResponse.next();
            if (session) {
                response.headers.set('x-user-authenticated', 'true');
                response.headers.set('x-user-id', session.user.id);
            }
            return response;
        }
        if (!session) {
            if (options.onUnauthorized) {
                return options.onUnauthorized(request);
            }
            return server_1.NextResponse.redirect(new URL('/api/auth/signin', request.url));
        }
        if (sessionManager.isSessionExpired(session)) {
            const response = server_1.NextResponse.redirect(new URL('/api/auth/signin', request.url));
            sessionManager.clearSessionCookie(response);
            return response;
        }
        if (options.requiredRoles && options.requiredRoles.length > 0) {
            const userRoles = session.user.roles || [];
            const hasRequiredRole = options.requiredRoles.some(role => userRoles.includes(role));
            if (!hasRequiredRole) {
                if (options.onForbidden) {
                    return options.onForbidden(request, session);
                }
                return server_1.NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
        }
        if (options.requiredClaims) {
            const userClaims = session.user.claims || {};
            const hasRequiredClaims = Object.entries(options.requiredClaims).every(([key, value]) => userClaims[key] === value);
            if (!hasRequiredClaims) {
                if (options.onForbidden) {
                    return options.onForbidden(request, session);
                }
                return server_1.NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
        }
        const response = server_1.NextResponse.next();
        response.headers.set('x-user-authenticated', 'true');
        response.headers.set('x-user-id', session.user.id);
        return response;
    };
}
