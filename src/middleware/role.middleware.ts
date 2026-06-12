import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client'; // Import ang tamang enum

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: Role;
  };
}

export const authorizeRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};
