import { Router } from 'express';
import type { AppModule } from '../module.types.js';
import { authRoutes } from './auth.route.js';

export const authModule: AppModule = {
  basePath: '/auth',

  openapiPaths: {
    '/auth/login': {
      post: {
        summary: 'User Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                  },
                  password: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          400: { description: 'Invalid credentials' },
        },
      },
    },

    '/auth/me': {
      get: {
        summary: 'Get Profile',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Success' },
          401: { description: 'Unauthorized' },
        },
      },
      patch: {
        summary: 'Update Profile',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated successfully' },
          400: { description: 'Failed to update profile' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    '/auth/password': {
      patch: {
        summary: 'Update password',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['oldPassword', 'newPassword'],
                properties: {
                  oldPassword: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password updated successfully' },
          400: { description: 'Invalid current password or validation error' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    '/auth/logout': {
      post: {
        summary: 'Logout user',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
  },

  register: () => {
    const router = Router();
    router.use('/', authRoutes);
    return router;
  },
};
