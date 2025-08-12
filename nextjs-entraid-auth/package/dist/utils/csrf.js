"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRFProtection = void 0;
const crypto_1 = require("crypto");
class CSRFProtection {
    constructor(secret) {
        this.secret = secret;
    }
    generateToken() {
        const randomValue = (0, crypto_1.randomBytes)(32).toString('hex');
        const timestamp = Date.now().toString();
        const payload = `${randomValue}.${timestamp}`;
        const signature = (0, crypto_1.createHmac)('sha256', this.secret).update(payload).digest('hex');
        return `${payload}.${signature}`;
    }
    validateToken(token, maxAge = 3600000) {
        if (!token)
            return false;
        const parts = token.split('.');
        if (parts.length !== 3)
            return false;
        const [randomValue, timestamp, signature] = parts;
        const payload = `${randomValue}.${timestamp}`;
        const expectedSignature = (0, crypto_1.createHmac)('sha256', this.secret).update(payload).digest('hex');
        if (!(0, crypto_1.timingSafeEqual)(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
            return false;
        }
        const tokenTimestamp = parseInt(timestamp, 10);
        if (isNaN(tokenTimestamp) || Date.now() - tokenTimestamp > maxAge) {
            return false;
        }
        return true;
    }
    extractTokenFromRequest(request) {
        const headerToken = request.headers.get('x-csrf-token');
        if (headerToken)
            return headerToken;
        const formData = request.nextUrl.searchParams.get('_csrf');
        if (formData)
            return formData;
        return null;
    }
}
exports.CSRFProtection = CSRFProtection;
