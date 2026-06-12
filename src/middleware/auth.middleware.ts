import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: Role;
      };
    }
  }
}

/**
 * Validates the incoming Bearer token inside the Authorization header.
 * Attaches the decoded token payload to the Express Request object.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. Token payload is missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      (process.env.JWT_SECRET as string) || 'fallback_secret',
    ) as unknown as { sub: string; username: string; role: Role };

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
    return;
  }
};

/**
 * Enforces Role-Based Access Control (RBAC).
 * Rejects requests with a 403 status if the user's role is not explicitly allowed.
 */
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized. User session not found.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden. Your role (${req.user.role}) does not have permission to perform this action.`,
      });
      return;
    }

    next();
  };
};
