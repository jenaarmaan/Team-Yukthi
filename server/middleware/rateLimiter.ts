import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Enterprise Sliding-Window Rate Limiter Middleware
 * Protects APIs from brute-force attempts and DoS abuse.
 */
export const createRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  skipInternalTest?: boolean;
}) => {
  const { windowMs, maxRequests, keyPrefix = 'rate' } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Optional bypass for verified super admin or tests
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const key = `${keyPrefix}:${clientIp}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please retry in ${retryAfterSeconds} seconds.`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
    next();
  };
};

// Standard sensitive rate limiter for authentication & check-in
export const sensitiveEndpointLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyPrefix: 'sensitive'
});

// Standard API limiter
export const standardApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  keyPrefix: 'std'
});
