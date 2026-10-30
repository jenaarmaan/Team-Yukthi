import { Router } from 'express';
import { InterviewerWorkspaceController } from '../controllers/interviewerWorkspaceController.ts';
import { authenticateToken, requirePermission } from '../middleware/auth.ts';

const router = Router();

// All interviewer workspace routes require authenticated session
router.use(authenticateToken);

// 1. Dashboard Telemetry & Summary
router.get(
  '/workspace/summary',
  requirePermission('interviewer:workspace:view'),
  InterviewerWorkspaceController.getWorkspaceSummary
);

// 2. Personal Schedule
router.get(
  '/schedule/today',
  requirePermission('interviewer:workspace:view'),
  InterviewerWorkspaceController.getTodaySchedule
);

// 3. Candidate Privacy-Preserving Snapshot
router.get(
  '/candidates/:id/snapshot',
  requirePermission('interviewer:candidates:view'),
  InterviewerWorkspaceController.getCandidateSnapshot
);

// 4. Suggested Questions
router.post(
  '/questions/suggest',
  requirePermission('interviewer:questions:view'),
  InterviewerWorkspaceController.suggestQuestions
);

// 5. Live Interview Execution Actions
router.post(
  '/execution/actions',
  requirePermission('interviewer:execution:manage'),
  InterviewerWorkspaceController.executeInterviewAction
);

// 6. Scorecards & Evaluations
router.post(
  '/evaluations/draft',
  requirePermission('interviewer:evaluations:submit'),
  InterviewerWorkspaceController.saveScorecardDraft
);

router.post(
  '/evaluations/submit',
  requirePermission('interviewer:evaluations:submit'),
  InterviewerWorkspaceController.submitScorecard
);

// 7. Availability & Leaves
router.get(
  '/availability',
  requirePermission('interviewer:availability:view'),
  InterviewerWorkspaceController.getAvailability
);

router.post(
  '/availability',
  requirePermission('interviewer:availability:manage'),
  InterviewerWorkspaceController.updateAvailability
);

// 8. Confidential Conflict of Interest
router.post(
  '/conflicts',
  requirePermission('interviewer:conflicts:declare'),
  InterviewerWorkspaceController.declareConflict
);

router.get(
  '/conflicts',
  requirePermission('interviewer:conflicts:view_own'),
  InterviewerWorkspaceController.getConflicts
);

// 9. Operational & Technical Incidents
router.post(
  '/incidents',
  requirePermission('interviewer:incidents:report'),
  InterviewerWorkspaceController.reportIncident
);

router.get(
  '/incidents',
  requirePermission('interviewer:incidents:view'),
  InterviewerWorkspaceController.getIncidents
);

export const interviewerWorkspaceRoutes = router;

