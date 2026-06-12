import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';
import { corsOrigins } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { buildOpenApiDocument } from './lib/openapi.js';
import { modules } from './modules/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { API_PREFIX } from './config/constants.js';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: corsOrigins,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json());

  // Build the OpenAPI document once at startup.
  const openApiDocument = buildOpenApiDocument();

  // --- API docs (consumed by the frontend's Orval, and browsable via Swagger UI) ---
  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  // --- Composition root: register every feature module under the versioned API prefix ---
  const deps = { prisma };
  for (const featureModule of modules) {
    app.use(`${API_PREFIX}${featureModule.basePath}`, featureModule.register(deps));
  }

  // --- Tail middleware ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
