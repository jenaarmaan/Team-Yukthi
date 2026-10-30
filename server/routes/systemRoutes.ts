import { Router } from 'express';
import { SystemController } from '../controllers/systemController.ts';

const router = Router();

// GET /api/v1/system/info
router.get('/info', SystemController.getSystemInfo);

export const systemRoutes = router;
