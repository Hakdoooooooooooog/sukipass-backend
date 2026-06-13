import type { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import type { Role } from '@prisma/client';

export class AdminController {
  private adminService = new AdminService();

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const roleQuery = (req.query.role as string)?.toUpperCase();

    const validRoles = ['ADMIN', 'BUSINESS_OWNER', 'STAFF', 'CUSTOMER'];

    if (roleQuery && !validRoles.includes(roleQuery)) {
      res.status(400).json({ error: `Invalid role. Allowed: ${validRoles.join(', ')}` });
      return;
    }

    const users = await this.adminService.getUsers(roleQuery as Role);
    res.status(200).json({ data: users });
  };
}

export const adminController = new AdminController();
