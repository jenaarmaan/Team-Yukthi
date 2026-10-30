import { Router, Request, Response } from 'express';
import {
  authenticateToken,
  requireRole,
  requirePermission,
  requireCandidateOwnership
} from '../middleware/auth.ts';
import { sendSuccess } from '../utils/response.ts';
import { candidateProfilesRepository, internalHRNotesRepository, auditLogsRepository } from '../repositories/index.ts';

const router = Router();

// Apply authentication to all administrative and protected test routes
router.use(authenticateToken);

// 1. Super Admin Exclusive Operation (e.g. system security configuration & enterprise settings)
router.get('/super-admin-only', requireRole(['super_admin']), (req: Request, res: Response) => {
  sendSuccess(res, {
    accessGranted: true,
    userRole: req.user?.role,
    operation: 'super_admin_system_governance'
  }, 'Super Admin privileged operation authorized.');
});

// 2. HR Admin Operation (e.g. hiring drive lifecycle & absence ratification)
router.get('/hr-only', requireRole(['super_admin', 'hr_admin']), (req: Request, res: Response) => {
  sendSuccess(res, {
    accessGranted: true,
    userRole: req.user?.role,
    operation: 'hr_administrative_management'
  }, 'HR Admin privileged operation authorized.');
});

// 3. Recruitment Manager Operation (e.g. candidate vetting & standby pool dispatch)
router.get('/manager-only', requireRole(['super_admin', 'hr_admin', 'recruitment_manager']), (req: Request, res: Response) => {
  sendSuccess(res, {
    accessGranted: true,
    userRole: req.user?.role,
    operation: 'talent_pipeline_management'
  }, 'Recruitment Manager privileged operation authorized.');
});

// 4. Interview Coordinator Operation (e.g. venue desk & panel scheduling)
router.get('/coordinator-only', requireRole(['super_admin', 'hr_admin', 'interview_coordinator']), (req: Request, res: Response) => {
  sendSuccess(res, {
    accessGranted: true,
    userRole: req.user?.role,
    operation: 'venue_desk_scheduling'
  }, 'Interview Coordinator operation authorized.');
});

// 5. Interviewer Panel Access (e.g. assigned interview evaluations)
router.get('/interviewer-only', requireRole(['super_admin', 'hr_admin', 'interview_coordinator', 'interviewer']), (req: Request, res: Response) => {
  sendSuccess(res, {
    accessGranted: true,
    userRole: req.user?.role,
    operation: 'panel_candidate_evaluation'
  }, 'Interviewer panel evaluation authorized.');
});

// 6. Internal HR Notes: Strictly FORBIDDEN to Candidates!
router.get('/notes/:candidateId', requirePermission('notes:view'), async (req: Request, res: Response) => {
  const { candidateId } = req.params;
  const notes = await internalHRNotesRepository.findByField('candidateId', candidateId);
  sendSuccess(res, {
    candidateId,
    notes,
    retrievedByRole: req.user?.role
  }, 'Confidential HR notes retrieved.');
});

// 7. Candidate Profile with Strict Ownership Enforcement
router.get('/candidates/:candidateId/profile', requireCandidateOwnership('candidateId'), async (req: Request, res: Response) => {
  const { candidateId } = req.params;
  const profile = await candidateProfilesRepository.findById(candidateId);
  sendSuccess(res, {
    candidateId,
    profile,
    requestedBy: req.user?.uid,
    role: req.user?.role
  }, 'Candidate profile retrieved successfully.');
});

// 8. Immutable Enterprise Audit Logs
router.get('/audit-logs', requireRole(['super_admin', 'hr_admin', 'recruitment_manager', 'interview_coordinator']), async (req: Request, res: Response) => {
  const logs = await auditLogsRepository.findAll(100);
  sendSuccess(res, logs, 'Authoritative enterprise audit logs retrieved.');
});

export const adminRoutes = router;
