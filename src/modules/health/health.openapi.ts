import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { HealthResponseSchema } from './health.schema.js';

export const healthPaths: ZodOpenApiPathsObject = {
  '/health': {
    get: {
      operationId: 'getHealth',
      summary: 'Service health check',
      tags: ['health'],
      responses: {
        '200': {
          description: 'Service is healthy',
          content: {
            'application/json': { schema: HealthResponseSchema },
          },
        },
      },
    },
  },
};
