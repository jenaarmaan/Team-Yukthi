import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.ts';
import { authenticateToken, requireRole } from '../middleware/auth.ts';

const router = Router();

// Staff authentication required for all recruitment analytics
router.use(authenticateToken);
router.use(requireRole(['super_admin', 'hr_admin', 'recruitment_manager', 'interview_coordinator']));

// 1. Natural Language & Voice-to-Text RAG Analytics Query
router.post('/rag-query', AnalyticsController.executeRagQuery);

// 2. High-level Analytics Overview
router.get('/overview', AnalyticsController.getAnalyticsOverview);

// 3. Dynamic AI Insights and Recommendations
router.get('/insights', AnalyticsController.getAIInsights);

export { router as analyticsRoutes };

