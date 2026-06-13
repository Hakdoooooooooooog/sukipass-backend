import { Router } from 'express';
import type { AppModule, AppDeps } from '../module.types.js';
import { StaffController } from './staff.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { verifyStaffOwnership } from '../../middleware/ownership.middleware.js';

export const staffModule: AppModule = {
  basePath: '/staff',

  openapiPaths: {
    '/staff': {
      get: {
        summary: 'Get All Staff',
        tags: ['Staff'],
        responses: {
          200: {
            description: 'List of all staff retrieved successfully',
          },
        },
      },
      post: {
        summary: 'Create Staff',
        tags: ['Staff'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'juan_staff' },
                  email: { type: 'string', example: 'juan@sukipass.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Staff created successfully',
          },
        },
      },
    },
    '/staff/{id}': {
      get: {
        summary: 'Get Staff By ID',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The staff unique identifier',
          },
        ],
        responses: {
          200: {
            description: 'Staff profile retrieved successfully',
          },
          404: {
            description: 'Staff not found',
          },
        },
      },
      patch: {
        summary: 'Update Staff Details',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The staff unique identifier',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'juan_updated' },
                  email: { type: 'string', example: 'juan.new@sukipass.com' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff profile updated successfully',
          },
          404: {
            description: 'Staff not found',
          },
        },
      },
      delete: {
        summary: 'Delete Staff',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The staff unique identifier',
          },
        ],
        responses: {
          200: {
            description: 'Staff deleted successfully',
          },
          404: {
            description: 'Staff not found',
          },
        },
      },
    },
  },

  register: (_deps: AppDeps) => {
    const router = Router();
    const controller = new StaffController();

    router.use(authenticateJWT);

    router.use((req, res, next) => {
      const user = (req as { user?: { role: string } }).user;
      if (user?.role !== 'BUSINESS_OWNER') {
        return res.status(403).json({ error: 'Forbidden: Business Owner access only' });
      }
      next();
    });

    router.post('/', controller.createStaff);
    router.get('/', controller.getAllStaff);
    router.get('/:id', verifyStaffOwnership, controller.getStaffById);
    router.patch('/:id', verifyStaffOwnership, controller.updateStaff);
    router.delete('/:id', verifyStaffOwnership, controller.deleteStaff);

    return router;
  },
};
