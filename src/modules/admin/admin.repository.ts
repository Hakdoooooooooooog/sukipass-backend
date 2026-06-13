import { prisma } from '../../lib/prisma.js';
import type { Role } from '@prisma/client';

export class AdminRepository {
  async findAll(role?: Role) {
    return await prisma.user.findMany({
      where: role ? { role } : {},
      select: { id: true, username: true, email: true, role: true },
    });
  }
}
