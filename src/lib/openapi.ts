import { createDocument } from 'zod-openapi';
import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { modules } from '../modules/index.js';
import { env } from '../config/env.js';
import { API_PREFIX } from '../config/constants.js';

/** Merges every module's OpenAPI paths under the versioned API prefix. */
function collectPaths(): ZodOpenApiPathsObject {
  const paths: ZodOpenApiPathsObject = {};
  for (const featureModule of modules) {
    for (const [path, item] of Object.entries(featureModule.openapiPaths)) {
      const key = `${API_PREFIX}${path}`;
      // Deep-merge so multiple modules contributing the same path keep all their methods.
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
    paths: collectPaths(),
  });
}
