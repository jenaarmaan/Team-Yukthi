import { Router } from 'express';
import { ApplicationsController } from '../controllers/applicationsController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Candidate Application Operations
router.post('/apply', requirePermission('applications:apply'), ApplicationsController.applyForDrive);
router.get('/my', requirePermission('applications:view_own'), ApplicationsController.getMyApplications);
router.get('/my-applications', requirePermission('applications:view_own'), ApplicationsController.getMyApplications);
router.get('/my-application', requirePermission('applications:view_own'), ApplicationsController.getMyApplications);

// Admin Applications & Waitlist Operations
router.get('/', requirePermission('applications:view_all'), ApplicationsController.getAllApplications);
router.get('/admin/all', requirePermission('applications:view_all'), ApplicationsController.getAllApplications);
router.get('/admin/waitlists', requirePermission('applications:view_all'), ApplicationsController.getAllWaitlistApplications);
router.post('/:id/promote-waitlist', requirePermission('waitlist:promote'), ApplicationsController.promoteWaitlistCandidate);

// Specific Application by ID
router.get('/:id', ApplicationsController.getApplicationById);

export const applicationRoutes = router;
