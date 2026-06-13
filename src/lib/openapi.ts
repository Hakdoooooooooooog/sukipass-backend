import { createDocument } from 'zod-openapi';
import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { modules } from '../modules/index.js';
import { env } from '../config/env.js';
import { API_PREFIX } from '../config/constants.js';

function collectPaths(): ZodOpenApiPathsObject {
  const paths: ZodOpenApiPathsObject = {};
  for (const featureModule of modules) {
    for (const [path, item] of Object.entries(featureModule.openapiPaths)) {
      const key = `${API_PREFIX}${path}`;
      paths[key] = { ...paths[key], ...item };
    }
  }
  return paths;
}

export function buildOpenApiDocument(): ReturnType<typeof createDocument> {
  return createDocument({
    openapi: '3.1.0',
    info: {
      title: 'SukiPass API',
      version: '1.0.0',
      description: 'Digital loyalty platform API for Philippine MSMEs.',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterOwnerSchema: {
          type: 'object',
          required: ['username', 'email', 'password', 'businessName', 'physicalAddress'],
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            businessName: { type: 'string' },
            physicalAddress: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: collectPaths(),
  });
}
