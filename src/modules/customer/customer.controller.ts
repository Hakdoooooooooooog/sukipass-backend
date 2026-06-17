import type { Request, Response } from 'express';
import { CustomerService } from './customer.service.js';

export class CustomerController {
  private service = new CustomerService();

  getStamps = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const requestingUser = req.user;

      if (!requestingUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const isCustomer = requestingUser.role === 'CUSTOMER';
      const isAllowedRole =
        requestingUser.role === 'STAFF' ||
        requestingUser.role === 'BUSINESS_OWNER' ||
        requestingUser.role === 'ADMIN';

      if (isCustomer && requestingUser.id !== customerId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own stamps' });
      }

      if (!isCustomer && !isAllowedRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await this.service.getCustomerStamps(customerId as string);
      res.status(200).json({ data: result });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Error' });
    }
  };

  getRedemptions = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const requestingUser = req.user;

      if (!requestingUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const isCustomer = requestingUser.role === 'CUSTOMER';
      const isAllowedRole =
        requestingUser.role === 'STAFF' ||
        requestingUser.role === 'BUSINESS_OWNER' ||
        requestingUser.role === 'ADMIN';

      if (isCustomer && requestingUser.id !== customerId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own redemptions' });
      }

      if (!isCustomer && !isAllowedRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await this.service.getCustomerRedemptions(customerId as string);
      res.status(200).json({ data: result });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Error' });
    }
  };

  getCampaigns = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const requestingUser = req.user;

      if (!requestingUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const isCustomer = requestingUser.role === 'CUSTOMER';
      const isAllowedRole =
        requestingUser.role === 'STAFF' ||
        requestingUser.role === 'BUSINESS_OWNER' ||
        requestingUser.role === 'ADMIN';

      if (isCustomer && requestingUser.id !== customerId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own campaigns' });
      }

      if (!isCustomer && !isAllowedRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await this.service.getCustomerCampaigns(customerId as string);
      res.status(200).json({ data: result });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Error' });
    }
  };
}
