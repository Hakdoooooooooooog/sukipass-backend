import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { z } from 'zod';
import { BadRequestError } from './errorHandler.js';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/** Validates request parts against Zod schemas; replaces them with parsed data. */
export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    for (const key of ['body', 'query', 'params'] as const) {
      const schema = schemas[key];
      if (!schema) continue;
      const result = schema.safeParse(req[key]);
      if (!result.success) {
        next(new BadRequestError('Validation failed', z.flattenError(result.error)));
        return;
      }
      // Express 5: req.query is a getter; assign onto the object's properties instead.
      Object.assign(req[key] as object, result.data);
    }
    next();
  };
