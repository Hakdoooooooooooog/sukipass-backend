import { Router } from 'express';
import type { AppModule, AppDeps } from '../module.types.js';
import { CustomerController } from './customer.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

export const customerModule: AppModule = {
  basePath: '/customers',

  openapiPaths: {
    '/customers/{customerId}/campaigns': {
      get: {
        summary: 'Get Customer Campaigns',
        tags: ['Customer'],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The customer unique identifier',
          },
        ],
        responses: {
          200: {
            description: 'Customer campaigns retrieved successfully',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Customer not found',
          },
        },
      },
    },
    '/customers/{customerId}/stamps': {
      get: {
        summary: 'Get Customer Stamp History',
        tags: ['Customer'],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The customer unique identifier',
          },
        ],
        responses: {
          200: { description: 'Customer stamp history retrieved successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'Customer not found' },
        },
      },
    },
    '/customers/{customerId}/redemptions': {
      get: {
        summary: 'Get Customer Redemptions',
        tags: ['Customer'],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The customer unique identifier',
          },
        ],
        responses: {
          200: { description: 'Customer redemption history retrieved successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'Customer not found' },
        },
      },
    },
  },

  register: (_deps: AppDeps) => {
    const router = Router();
    const controller = new CustomerController();

    router.use(authenticateJWT);

    router.get('/:customerId/campaigns', controller.getCampaigns);
    router.get('/:customerId/stamps', controller.getStamps);
    router.get('/:customerId/redemptions', controller.getRedemptions);

    return router;
  },
};
