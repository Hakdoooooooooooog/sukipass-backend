import { createDocument } from 'zod-openapi';
import { healthPaths } from '../modules/health/health.openapi.js';

export function buildOpenApiDocument(): ReturnType<typeof createDocument> {
  return createDocument({
    openapi: '3.1.0',
    info: {
      title: 'SukiPass API',
      version: '1.0.0',
      description: 'Digital loyalty platform API for Philippine MSMEs.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
      ...healthPaths,
    },
  });
}
