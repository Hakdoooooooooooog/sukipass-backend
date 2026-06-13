import type { Request, Response } from 'express';
import { StaffService } from './staff.service.js';
import { CreateStaffSchema, UpdateStaffSchema } from './staff.schema.js';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

export class StaffController {
  private service = new StaffService();

  createStaff = async (req: Request, res: Response) => {
    try {
      const parsed = CreateStaffSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      }

      const data = parsed.data;
      const userId = (req as { user?: { id: string } }).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userBusiness = await prisma.business.findFirst({
        where: { ownerId: userId },
      });

      if (!userBusiness) {
        return res.status(404).json({ error: 'No business found associated with your account' });
      }

      const { password, ...restData } = data;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Passing mapped structure down the service pipeline
      const result = await this.service.createStaff({
        ...restData,
        password: hashedPassword,
        businessId: userBusiness.id,
      });

      res.status(201).json({ data: result });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Error' });
    }
  };

  getAllStaff = async (req: Request, res: Response) => {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await this.service.getAllStaffByOwner(userId);
    res.json({ data: result });
  };

  getStaffById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.getStaffById(id);
    res.json({ data: result });
  };

  updateStaff = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data = UpdateStaffSchema.parse(req.body);

      const payload: { username?: string; email?: string } = {};
      if (data.username) payload.username = data.username;
      if (data.email) payload.email = data.email;

      const result = await this.service.updateStaff(id, payload);
      res.json({ message: 'Staff updated', data: result });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Error' });
    }
  };

  deleteStaff = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.deleteStaff(id);
    res.json({ message: 'Staff deleted', data: result });
  };
}
