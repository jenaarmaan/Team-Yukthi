import { Router } from 'express';
import { StandbyController } from '../controllers/standbyController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// 1. Standby Candidate Pool
router.get('/', requirePermission('standby:view_all'), StandbyController.getAllStandbyApplications);
router.get('/admin/all', requirePermission('standby:view_all'), StandbyController.getAllStandbyApplications);
router.post('/invite', requirePermission('standby:invite'), StandbyController.sendStandbyInvitation);
router.post('/:applicationId/respond', StandbyController.respondToStandbyInvitation);

// 2. Urgent Replacement Slot Claims (with 4-hour window & concurrency mutex)
router.post('/:applicationId/claim-replacement', requirePermission('standby:claim'), StandbyController.acceptReplacementSlot);

// 3. Concurrency Collision Simulation Test Endpoint
router.post('/simulate-concurrent-claim', StandbyController.simulateConcurrentClaim);

// 4. Standby 100-pt Matching Score Engine
router.get('/match-score', StandbyController.getMatchScore);

// 5. Vacant Slot Self-Healing Incidents
router.get('/recoveries', requirePermission('recovery:view'), StandbyController.getRecoveries);
router.post('/recoveries/:id/trigger', requirePermission('recovery:trigger'), StandbyController.triggerRecovery);
router.post('/recoveries/:id/confirm', requirePermission('recovery:trigger'), StandbyController.confirmRecovery);

export const standbyRoutes = router;
