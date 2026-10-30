import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger.ts';
import { AppError, sendError } from '../utils/response.ts';

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  // Generic internal server error
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal Server Error';

  sendError(res, message, statusCode, 'INTERNAL_SERVER_ERROR');
};

export const notFoundHandler = (req: Request, res: Response): void => {
  if (req.originalUrl.startsWith('/api/')) {
    sendError(
      res,
      `API endpoint not found: ${req.method} ${req.originalUrl}`,
      404,
      'ENDPOINT_NOT_FOUND'
    );
  } else {
    res.status(404).send('Page not found');
  }
};
