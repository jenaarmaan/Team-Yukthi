import { Router } from 'express';
import { NotesAndInterviewerController } from '../controllers/notesAndInterviewerController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Interviewer Roster & Panel Management
router.get('/', requirePermission('interviewers:view'), NotesAndInterviewerController.getInterviewers);
router.post('/', requirePermission('interviewers:manage'), NotesAndInterviewerController.addInterviewer);

export const interviewerRoutes = router;
