import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();
const authController = new AuthController();

/**
 * Public
 */
router.post('/login', authController.login);

/**
 * Protected
 */
router.get('/me', authenticateJWT, authController.me);
router.patch('/me', authenticateJWT, authController.updateProfile);
router.patch('/password', authenticateJWT, authController.updatePassword);
router.post('/logout', authenticateJWT, authController.logout);

export const authRoutes = router;
