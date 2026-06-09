import type { AppModule } from '../module.types.js';
import { healthPaths } from './health.openapi.js';
import { createHealthRouter } from './health.routes.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { PrismaHealthRepository } from './health.repository.js';

export const healthModule: AppModule = {
  basePath: '/health',
  openapiPaths: healthPaths,
  register: ({ prisma }) =>
    createHealthRouter(new HealthController(new HealthService(new PrismaHealthRepository(prisma)))),
};
