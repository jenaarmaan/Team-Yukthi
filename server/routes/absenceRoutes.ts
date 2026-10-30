import { Router } from 'express';
import { AbsenceController } from '../controllers/absenceController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Candidate submits justification (Experienced candidates only; fresher rejected)
router.post('/submit', requirePermission('absence:submit'), AbsenceController.submitAbsenceExplanation);

// HR Absence Governance
router.get('/', requirePermission('absence:view_all'), AbsenceController.getAllAbsenceRecords);
router.get('/records', requirePermission('absence:view_all'), AbsenceController.getAllAbsenceRecords);
router.post('/:applicationId/decision', requirePermission('absence:ratify'), AbsenceController.simulateHrAbsenceDecision);

export const absenceRoutes = router;
