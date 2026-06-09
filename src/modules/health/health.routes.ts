import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import type { HealthController } from './health.controller.js';

export function createHealthRouter(controller: HealthController): Router {
  const router = Router();
  router.get('/', asyncHandler(controller.getHealth));
  return router;
}
