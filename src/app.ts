import express from 'express';
import cors from 'cors';
import type { Express } from 'express';
import { corsOrigins } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { buildOpenApiDocument } from './lib/openapi.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { PrismaHealthRepository } from './modules/health/health.repository.js';
import { HealthService } from './modules/health/health.service.js';
import { HealthController } from './modules/health/health.controller.js';
import { createHealthRouter } from './modules/health/health.routes.js';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());

  // --- OpenAPI document (consumed by the frontend's Orval) ---
  app.get('/openapi.json', (_req, res) => {
    res.json(buildOpenApiDocument());
  });

  // --- Composition root: wire each module's dependencies ---
  const healthRepository = new PrismaHealthRepository(prisma);
  const healthService = new HealthService(healthRepository);
  const healthController = new HealthController(healthService);
  app.use('/health', createHealthRouter(healthController));

  // --- Tail middleware ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
