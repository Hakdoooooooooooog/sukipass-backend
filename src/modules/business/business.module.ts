import type { AppModule, AppDeps } from '../module.types.js';
import businessRoutes from './business.route.js';

export const businessModule: AppModule = {
  basePath: '/business',

  openapiPaths: {
    '/business': {
      get: {
        summary: 'Get All Businesses',
        tags: ['Business'],
        parameters: [
          {
            name: 'search',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Search businesses by name or address or category',
          },
        ],
        responses: {
          200: {
            description: 'List of all businesses retrieved successfully',
          },
        },
      },
      post: {
        summary: 'Create Business',
        tags: ['Business'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'username',
                  'email',
                  'password',
                  'business_name',
                  'physical_address',
                  'category',
                  'contact_number',
                ],
                properties: {
                  username: { type: 'string', example: 'aling_nena_caloocan' },
                  email: { type: 'string', example: 'nena@sukipass.com' },
                  password: { type: 'string', example: 'securepassword123' },
                  business_name: { type: 'string', example: "Aling Nena's Suki Store v2" },
                  physical_address: { type: 'string', example: '123 Rizal Avenue, Caloocan City' },
                  category: { type: 'string', example: 'Retail / Grocery' },
                  contact_number: { type: 'string', example: '09171234567' },
                  profile: {
                    type: 'object',
                    properties: {
                      tagline: { type: 'string', example: 'Ang paboritong tindahan ng bayan!' },
                      description: {
                        type: 'string',
                        example: 'Providing daily essentials to our local community since 2020.',
                      },
                      business_hours: { type: 'object' },
                      social_links: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Business created successfully',
          },
        },
      },
    },
    '/business/{id}': {
      get: {
        summary: 'Get Business By ID',
        tags: ['Business'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The business unique identifier',
          },
        ],
        responses: {
          200: {
            description: 'Business profile retrieved successfully',
          },
          404: {
            description: 'Business not found',
          },
        },
      },
      patch: {
        summary: 'Update Business Details',
        tags: ['Business'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The business unique identifier',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  business_name: { type: 'string', example: "Aling Nena's Supermart" },
                  physical_address: { type: 'string', example: '123 Rizal Avenue, Caloocan City' },
                  category: { type: 'string', example: 'Retail / Grocery' },
                  contact_number: { type: 'string', example: '09171234567' },
                  profile: {
                    type: 'object',
                    properties: {
                      tagline: { type: 'string', example: 'Mas pinalaki, mas pinamura!' },
                      description: {
                        type: 'string',
                        example: 'Providing daily essentials to our local community since 2020.',
                      },
                      business_hours: { type: 'object' },
                      social_links: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Business profile updated successfully',
          },
          404: {
            description: 'Business not found',
          },
        },
      },
    },
  },

  register: (_deps: AppDeps) => {
    return businessRoutes;
  },
};
