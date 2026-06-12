import { StaffRepository } from './staff.repository.js';
import { prisma } from '../../lib/prisma.js';

export class StaffService {
  private repo = new StaffRepository();

  async createStaff(data: {
    username: string;
    email: string;
    password: string;
    businessId: string;
  }) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error('Email is already registered');
    }

    return this.repo.createStaff(data);
  }

  async getAllStaffByOwner(ownerId: string) {
    return this.repo.findAllStaffByOwner(ownerId);
  }

  async getStaffById(id: string) {
    const staff = await this.repo.findStaffById(id);
    if (!staff) {
      throw new Error('Staff not found');
    }
    return staff;
  }

  async updateStaff(
    id: string,
    data: {
      username?: string;
      email?: string;
      businessId?: string;
    },
  ) {
    const currentStaff = await prisma.staffProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!currentStaff) {
      throw new Error('Staff profile not found');
    }

    if (data.username && data.username !== currentStaff.user.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existingUsername) {
        throw new Error('Username is already taken by another user');
      }
    }

    if (data.email && data.email !== currentStaff.user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new Error('Email is already registered by another user');
      }
    }

    return this.repo.updateStaff(id, data);
  }

  async deleteStaff(id: string) {
    const staff = await this.repo.findStaffById(id);
    if (!staff) {
      throw new Error('Staff not found');
    }
    return this.repo.deleteStaff(id);
  }
}
