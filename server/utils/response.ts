import { Response } from 'express';
import { ApiResponse, ApiErrorResponse } from '../types/index.ts';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): void => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: unknown
): void => {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  };
  res.status(statusCode).json(payload);
};

export const sendBadRequest = (res: Response, message: string, details?: unknown): void => {
  sendError(res, message, 400, 'BAD_REQUEST', details);
};

export const sendUnauthorized = (res: Response, message: string, details?: unknown): void => {
  sendError(res, message, 401, 'UNAUTHORIZED', details);
};

export const sendForbidden = (res: Response, message: string, details?: unknown): void => {
  sendError(res, message, 403, 'FORBIDDEN', details);
};

export const sendNotFound = (res: Response, message: string, details?: unknown): void => {
  sendError(res, message, 404, 'NOT_FOUND', details);
};

export const sendConflict = (res: Response, message: string, details?: unknown): void => {
  sendError(res, message, 409, 'CONFLICT', details);
};

