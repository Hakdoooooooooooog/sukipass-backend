import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { BusinessRepository } from './business.repository.js';
import { BusinessService } from './business.service.js';
import { BusinessController } from './business.controller.js';
import { validate } from '../../middleware/validate.js';
import { CreateBusinessSchema, UpdateBusinessSchema } from './business.schema.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const businessRepository = new BusinessRepository(prisma);
const businessService = new BusinessService(businessRepository);
const businessController = new BusinessController(businessService);

const router = Router();

// GET all business records
router.get('/', businessController.getAllPublic);

// GET a specific business profile by ID
router.get('/:id', businessController.getBusinessById);

// POST onboarding validation routing entrypoint
router.post(
  '/',
  authenticateJWT,
  validate(CreateBusinessSchema.shape),
  businessController.createBusiness,
);

// PATCH profile mutation updating schemas dynamically
router.patch(
  '/:id',
  authenticateJWT,
  validate(UpdateBusinessSchema.shape),
  businessController.updateBusiness,
);

export default router;
