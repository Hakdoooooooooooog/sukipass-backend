import { prisma } from '../../lib/prisma.js';

export class StaffRepository {
  /**
   * Creates a new user with the STAFF role and generates a matching relational StaffProfile.
   */
  async createStaff(data: {
    username: string;
    email: string;
    password: string;
    businessId: string;
  }) {
    // Generate tracking ID using alphanumeric slicing instead of timestamps for cleaner visual format
    const trackingId = Math.random().toString(36).substring(2, 7).toUpperCase();

    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'STAFF',
        accountNumber: `STF-${trackingId}`,
        staffProfile: {
          create: {
            businessId: data.businessId,
          },
        },
      },
    });
  }

  /**
   * Retrieves all staff profiles alongside their primary user credentials filtered by owner.
   */
  async findAllStaffByOwner(ownerId: string) {
    return prisma.staffProfile.findMany({
      where: {
        business: {
          ownerId: ownerId,
        },
      },
      include: { user: true },
    });
  }

  /**
   * Retrieves a specific staff profile by its ID.
   */
  async findStaffById(id: string) {
    return prisma.staffProfile.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  /**
   * Updates an existing staff profiling tier and its nested profile mappings.
   */
  async updateStaff(
    id: string,
    data: {
      username?: string;
      email?: string;
      businessId?: string;
    },
  ) {
    const userUpdate: Record<string, string> = {};
    const profileUpdate: Record<string, string> = {};

    if (data.username !== undefined) userUpdate.username = data.username;
    if (data.email !== undefined) userUpdate.email = data.email;
    if (data.businessId !== undefined) profileUpdate.businessId = data.businessId;

    return prisma.staffProfile.update({
      where: { id },
      data: {
        ...profileUpdate,
        ...(Object.keys(userUpdate).length > 0 && {
          user: {
            update: userUpdate,
          },
        }),
      },
      include: { user: true },
    });
  }

  /**
   * Deletes a staff profile and its associated user entity by ID.
   */
  async deleteStaff(id: string) {
    const staff = await prisma.staffProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!staff) {
      throw new Error('Staff profile not found');
    }

    return prisma.$transaction(async (tx) => {
      await tx.staffProfile.delete({
        where: { id },
      });

      return tx.user.delete({
        where: { id: staff.userId },
      });
    });
  }
}
