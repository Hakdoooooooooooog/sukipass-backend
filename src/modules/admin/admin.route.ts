import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { authorizeRole } from '../../middleware/role.middleware.js';
import type { Role } from '@prisma/client';

export const adminRoutes = Router();

adminRoutes.get(
  '/users',
  authenticateJWT,
  authorizeRole(['ADMIN'] as Role[]),
  adminController.getAllUsers,
);
