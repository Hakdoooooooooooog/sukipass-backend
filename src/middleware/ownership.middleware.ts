import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const verifyStaffOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const staffId = req.params.id as string;
  const user = (req as { user?: { id: string } }).user;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const staff = await prisma.staffProfile.findUnique({
      where: { id: staffId },
      include: { business: true },
    });

    if (!staff) return res.status(404).json({ error: 'Staff not found' });

    // Strict check: Only the business owner can access/modify this staff
    if (staff.business.ownerId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this staff profile' });
    }

    next();
  } catch (error) {
    next(error);
  }
};
