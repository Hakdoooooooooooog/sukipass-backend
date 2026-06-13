import { Router } from 'express';
import { StaffController } from './staff.controller.js';

const router = Router();
const controller = new StaffController();

router.post('/', controller.createStaff);
router.get('/', controller.getAllStaff);
router.get('/:id', controller.getStaffById);
router.patch('/:id', controller.updateStaff);
router.delete('/:id', controller.deleteStaff);

export default router;
