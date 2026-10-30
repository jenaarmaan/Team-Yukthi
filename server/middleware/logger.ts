import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.ts';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Only log API routes in detail to keep console tidy
    if (originalUrl.startsWith('/api')) {
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms [${ip || 'unknown'}]`;
      if (statusCode >= 500) {
        logger.error(message);
      } else if (statusCode >= 400) {
        logger.warn(message);
      } else {
        logger.info(message);
      }
    }
  });

  next();
};
