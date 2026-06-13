import { Router } from 'express';
import type { AppModule } from '../module.types.js';
import { adminRoutes } from './admin.route.js';

export const adminModule: AppModule = {
  basePath: '/admin',

  openapiPaths: {
    '/admin/users': {
      get: {
        summary: 'Get all users',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'role',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by role',
          },
        ],
        responses: {
          200: { description: 'Success' },
          403: { description: 'Forbidden' },
        },
      },
    },
  },

  register: () => {
    const router = Router();
    router.use('/', adminRoutes);
    return router;
  },
};
