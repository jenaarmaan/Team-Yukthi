import { Router } from 'express';
import { NotesAndInterviewerController } from '../controllers/notesAndInterviewerController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Confidential HR Notes: Candidates are strictly rejected by 'notes:view' and 'notes:create'
router.get('/:candidateId', requirePermission('notes:view'), NotesAndInterviewerController.getInternalNotes);
router.post('/:candidateId', requirePermission('notes:create'), NotesAndInterviewerController.createInternalNote);

export const notesRoutes = router;
