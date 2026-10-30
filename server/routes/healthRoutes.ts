import { Router } from 'express';
import { HealthController } from '../controllers/healthController.ts';

const router = Router();

// GET /api/v1/health
router.get('/', HealthController.getHealth);

// GET /api/v1/health/database
router.get('/database', HealthController.getDatabaseHealth);

export const healthRoutes = router;
