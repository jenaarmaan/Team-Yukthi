import { Router } from 'express';
import { CandidatesController } from '../controllers/candidatesController.ts';
import {
  authenticateToken,
  requirePermission,
  requireCandidateOwnership
} from '../middleware/auth.ts';

const router = Router();

// Apply auth to all candidate routes
router.use(authenticateToken);

// Candidate self-service
router.get('/me', CandidatesController.getOwnProfile);
router.put('/me', CandidatesController.updateOwnProfile);
router.put('/me/locations', CandidatesController.updatePreferredLocations);
router.post('/me/resume', CandidatesController.uploadParsedResume);

// Administrative operations
router.get('/', requirePermission('applications:view_all'), CandidatesController.getAllCandidatesForAdmin);
router.get('/admin/all', requirePermission('applications:view_all'), CandidatesController.getAllCandidatesForAdmin);
router.get('/:candidateId', requireCandidateOwnership('candidateId'), CandidatesController.getCandidateById);
router.put('/:candidateId/skills/:skillId/verify', requirePermission('profile:verify'), CandidatesController.verifySkill);
router.put('/:candidateId/verification', requirePermission('profile:verify'), CandidatesController.updateCandidateProfileVerification);

export const candidateRoutes = router;
