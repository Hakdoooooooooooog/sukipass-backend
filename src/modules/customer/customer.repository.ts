import { prisma } from '../../lib/prisma.js';

export class CustomerRepository {
  async findCampaignsByCustomerId(customerId: string) {
    return prisma.customerCampaign.findMany({
      where: { customerId },
      include: {
        campaign: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
                address: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findStampsByCustomerId(customerId: string) {
    return prisma.transaction.findMany({
      where: {
        type: 'STAMP',
        customerCampaign: { customerId },
      },
      select: {
        id: true,
        stampCount: true,
        amount: true,
        createdAt: true,
        customerCampaign: {
          select: {
            campaign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRedemptionsByCustomerId(customerId: string) {
    return prisma.transaction.findMany({
      where: {
        type: 'REDEEM',
        customerCampaign: { customerId },
      },
      include: {
        customerCampaign: {
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                reward: true,
              },
            },
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCustomerById(customerId: string) {
    return prisma.user.findUnique({
      where: { id: customerId, role: 'CUSTOMER' },
      select: {
        id: true,
        accountNumber: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isTemporary: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
