import { CustomerRepository } from './customer.repository.js';

export class CustomerService {
  private repo = new CustomerRepository();

  async getCustomerStamps(customerId: string) {
    const customer = await this.repo.findCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const stamps = await this.repo.findStampsByCustomerId(customerId);

    return {
      stamps: stamps.map((t) => ({
        id: t.id,
        stampCount: t.stampCount,
        amount: t.amount ? Number(t.amount) : null,
        occurredAt: t.createdAt,
        campaign: t.customerCampaign.campaign,
      })),
    };
  }

  async getCustomerRedemptions(customerId: string) {
    const customer = await this.repo.findCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const redemptions = await this.repo.findRedemptionsByCustomerId(customerId);

    return {
      customer,
      redemptions: redemptions.map((t) => ({
        id: t.id,
        redeemedAt: t.createdAt,
        campaign: t.customerCampaign.campaign,
        business: t.business,
        performedBy: t.performedBy,
      })),
    };
  }

  async getCustomerCampaigns(customerId: string) {
    const customer = await this.repo.findCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const campaigns = await this.repo.findCampaignsByCustomerId(customerId);

    return {
      customer,
      campaigns: campaigns.map((cc) => ({
        enrollmentId: cc.id,
        stampCount: cc.stampCount,
        isCompleted: cc.isCompleted,
        enrolledAt: cc.createdAt,
        campaign: {
          id: cc.campaign.id,
          name: cc.campaign.name,
          description: cc.campaign.description,
          stampGoal: cc.campaign.stampGoal,
          reward: cc.campaign.reward,
          isActive: cc.campaign.isActive,
          business: cc.campaign.business,
        },
      })),
    };
  }
}
