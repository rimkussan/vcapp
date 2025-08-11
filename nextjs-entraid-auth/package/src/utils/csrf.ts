import { NextRequest } from 'next/server';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';

export class CSRFProtection {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  generateToken(): string {
    const randomValue = randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    const payload = `${randomValue}.${timestamp}`;
    const signature = createHmac('sha256', this.secret).update(payload).digest('hex');
    
    return `${payload}.${signature}`;
  }

  validateToken(token: string, maxAge = 3600000): boolean {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [randomValue, timestamp, signature] = parts;
    const payload = `${randomValue}.${timestamp}`;
    const expectedSignature = createHmac('sha256', this.secret).update(payload).digest('hex');

    if (!timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return false;
    }

    const tokenTimestamp = parseInt(timestamp, 10);
    if (isNaN(tokenTimestamp) || Date.now() - tokenTimestamp > maxAge) {
      return false;
    }

    return true;
  }

  extractTokenFromRequest(request: NextRequest): string | null {
    const headerToken = request.headers.get('x-csrf-token');
    if (headerToken) return headerToken;

    const formData = request.nextUrl.searchParams.get('_csrf');
    if (formData) return formData;

    return null;
  }
}