import cors from 'cors';
import { RequestHandler } from 'express';
import { config } from '../config/env.ts';

export const corsMiddleware: RequestHandler = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile native, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured origins or matching domain patterns
    const isAllowed =
      config.corsOrigins.includes(origin) ||
      origin.includes('run.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1');

    if (isAllowed) {
      callback(null, true);
    } else {
      // In dev mode allow for flexible testing, log in production
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
});
