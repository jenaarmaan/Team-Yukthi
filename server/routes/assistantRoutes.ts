import { Router } from 'express';
import { AssistantController } from '../controllers/assistantController.ts';

const router = Router();

// Assistant Endpoints
router.post('/chat', AssistantController.chat);
router.get('/history', AssistantController.getHistory);
router.delete('/history', AssistantController.clearHistory);
router.get('/status', AssistantController.getStatus);
router.post('/action', AssistantController.executeAction);

export const assistantRoutes = router;

