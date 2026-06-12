import { PrismaClient } from '@prisma/client';
import type { Business } from '@prisma/client';
import type { CreateBusinessInput, UpdateBusinessInput } from './business.schema.js';

export interface PublicBusiness {
  id: string;
  name: string;
  address: string;
  category: string | null;
  contactNumber: string | null;
  profile: Record<string, unknown>;
}

export class BusinessRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  // GET ALL businesses
  //   async findAll(): Promise<Business[]> {
  //     return this.prisma.business.findMany({
  //       include: { owner: true },
  //     });
  //   }

  async findAllPublic(query?: string): Promise<PublicBusiness[]> {
    const whereClause = query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { address: { contains: query, mode: 'insensitive' as const } },
            { category: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const businesses = await this.prisma.business.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        address: true,
        category: true,
        contactNumber: true,
        profile: true,
      },
    });

    return businesses as unknown as PublicBusiness[];
  }

  // GET specific business by id
  async findById(id: string): Promise<Business | null> {
    return this.prisma.business.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  // POST create business with owner account using transaction
  async createWithOwner(
    data: CreateBusinessInput['body'] & { passwordHash: string },
    ownerAccountNumber: string,
  ): Promise<unknown> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: data.passwordHash,
          role: 'BUSINESS_OWNER',
          accountNumber: ownerAccountNumber,
        },
      });

      const business = await tx.business.create({
        data: {
          name: data.business_name,
          address: data.physical_address,
          category: data.category,
          contactNumber: data.contact_number, // map snake_case to camelCase column
          profile: data.profile || {}, // save profile object directly as json
          ownerId: user.id,
        },
      });

      return { user, business };
    });
  }

  // PATCH update business details
  async update(id: string, data: UpdateBusinessInput['body']): Promise<Business> {
    return this.prisma.business.update({
      // Fixed typo here
      where: { id },
      data: {
        ...(data.business_name && { name: data.business_name }),
        ...(data.physical_address && { address: data.physical_address }),
        ...(data.category && { category: data.category }),
        ...(data.contact_number && { contactNumber: data.contact_number }),
        ...(data.profile && { profile: data.profile }),
      },
      include: { owner: true },
    });
  }
}
