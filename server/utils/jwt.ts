import crypto from 'crypto';
import { adminAuth } from '../config/firebase.ts';
import { UserRole } from '../repositories/types.ts';
import { AuthenticatedUser } from '../middleware/auth.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'niyojan-enterprise-jwt-signing-secret-2026-secure';

export interface TokenPayload {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  iat: number;
  exp: number;
}

// In-memory revocation set for revoked sessions
const revokedTokens = new Set<string>();
const revokedUsers = new Map<string, number>(); // uid -> timestamp after which tokens are valid

export class JwtUtil {
  private static base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf8');
  }

  /**
   * Signs a secure HS256 JSON Web Token with role and user identity.
   */
  public static sign(
    payload: { uid: string; email: string; role: UserRole; displayName?: string },
    expiresInSeconds = 3600
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const fullPayload: TokenPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Verifies either a Firebase Admin RS256 ID Token or an HS256 Token.
   */
  public static async verify(token: string): Promise<AuthenticatedUser> {
    if (!token || typeof token !== 'string') {
      const err = new Error('Token string is required');
      (err as any).code = 'auth/invalid-token';
      throw err;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      const err = new Error('Invalid JWT token format');
      (err as any).code = 'auth/argument-error';
      throw err;
    }

    // Check manual token revocation
    if (revokedTokens.has(token)) {
      const err = new Error('Token has been revoked upon logout');
      (err as any).code = 'auth/id-token-revoked';
      throw err;
    }

    // Try decoding header to see if it's an RS256 Firebase token
    try {
      const headerStr = this.base64UrlDecode(parts[0]);
      const header = JSON.parse(headerStr);

      if (header.alg === 'RS256') {
        const decoded = await adminAuth.verifyIdToken(token, true);
        return {
          uid: decoded.uid,
          email: decoded.email || '',
          role: (decoded.role as UserRole) || 'candidate',
          displayName: decoded.name || '',
          emailVerified: decoded.email_verified,
          customClaims: decoded
        };
      }
    } catch (fbErr: any) {
      if (fbErr.code?.startsWith('auth/')) {
        throw fbErr;
      }
    }

    // Verify HS256 signature
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      const err = new Error('Invalid token signature');
      (err as any).code = 'auth/invalid-token';
      throw err;
    }

    const payload: TokenPayload = JSON.parse(this.base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (payload.exp && payload.exp < now) {
      const err = new Error('Token has expired');
      (err as any).code = 'auth/id-token-expired';
      throw err;
    }

    // Check user revocation timestamp
    const revokedAfter = revokedUsers.get(payload.uid);
    if (revokedAfter && payload.iat <= revokedAfter) {
      const err = new Error('User session was revoked upon logout');
      (err as any).code = 'auth/id-token-revoked';
      throw err;
    }

    return {
      uid: payload.uid,
      email: payload.email,
      role: payload.role,
      displayName: payload.displayName || '',
      emailVerified: true
    };
  }

  /**
   * Revokes a specific token or all tokens for a user.
   */
  public static revokeToken(token: string): void {
    revokedTokens.add(token);
  }

  public static revokeUserSessions(uid: string): void {
    revokedUsers.set(uid, Math.floor(Date.now() / 1000));
  }
}
