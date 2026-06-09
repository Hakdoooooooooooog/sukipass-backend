import type { PrismaClient } from '../../generated/prisma/client.js';

export interface HealthRepository {
  /** Returns true if the database answers a trivial query. */
  ping(): Promise<boolean>;
}

export class PrismaHealthRepository implements HealthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async ping(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
