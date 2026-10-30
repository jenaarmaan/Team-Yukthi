import { Router } from 'express';
import { DrivesController } from '../controllers/drivesController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

// Public / Authenticated read drives
router.get('/', DrivesController.listDrives);
router.get('/:id', DrivesController.getDriveById);
router.get('/:id/eligibility', authenticateToken, DrivesController.checkEligibility);

// Protected Drive Management
router.post('/', authenticateToken, requirePermission('drives:create'), DrivesController.createDrive);
router.put('/:id', authenticateToken, requirePermission('drives:edit'), DrivesController.updateDrive);

export const driveRoutes = router;
