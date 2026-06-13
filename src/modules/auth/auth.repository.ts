import type { User, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

type UserWithBusinesses = Prisma.UserGetPayload<{
  include: { businesses: true };
}>;

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<UserWithBusinesses | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        businesses: true,
      },
    });
  }
}
