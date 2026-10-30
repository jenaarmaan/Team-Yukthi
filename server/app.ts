import express, { Express } from 'express';
import { corsMiddleware } from './middleware/cors.ts';
import { requestLogger } from './middleware/logger.ts';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.ts';
import { sanitizeRequestBody } from './middleware/sanitizer.ts';
import { standardApiLimiter } from './middleware/rateLimiter.ts';
import { apiRouter } from './routes/api.ts';
import { validateEnv } from './config/env.ts';


export const createApp = (): Express => {
  // Validate environment variables on startup
  validateEnv();

  const app: Express = express();

  // Basic security and parsing middlewares
  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Enterprise sanitization & rate limiting
  app.use(sanitizeRequestBody);
  app.use('/api/', standardApiLimiter);

  // Request logging
  app.use(requestLogger);

  // Mount API routers (/api/v1 authoritative, /api alias)
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);


  // Fallback for unmatched API routes
  app.use('/api/*', notFoundHandler);

  // Centralized error handling middleware
  app.use(errorHandler);

  return app;
};
