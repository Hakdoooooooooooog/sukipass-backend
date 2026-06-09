import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

// Express 5 detects error middleware by its 4-arg signature; `next` must stay.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Internal Server Error';

  if (!isAppError) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: { message, ...(isAppError && err.details ? { details: err.details } : {}) },
    ...(env.NODE_ENV !== 'production' && !isAppError && err instanceof Error
      ? { stack: err.stack }
      : {}),
  });
}
