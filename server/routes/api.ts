import { Router } from 'express';
import { healthRoutes } from './healthRoutes.ts';
import { systemRoutes } from './systemRoutes.ts';
import { authRoutes } from './authRoutes.ts';
import { storageRoutes } from './storageRoutes.ts';
import { adminRoutes } from './adminRoutes.ts';
import { candidateRoutes } from './candidateRoutes.ts';
import { driveRoutes } from './driveRoutes.ts';
import { applicationRoutes } from './applicationRoutes.ts';
import { standbyRoutes } from './standbyRoutes.ts';
import { absenceRoutes } from './absenceRoutes.ts';
import { attendanceRoutes } from './attendanceRoutes.ts';
import { notesRoutes } from './notesRoutes.ts';
import { interviewerRoutes } from './interviewerRoutes.ts';
import { interviewerWorkspaceRoutes } from './interviewerWorkspaceRoutes.ts';
import { notificationRoutes } from './notificationRoutes.ts';
import { analyticsRoutes } from './analyticsRoutes.ts';
import { assistantRoutes } from './assistantRoutes.ts';

const router = Router();

// Root API v1 info
router.get('/', (req, res) => {
  res.json({
    name: 'NIYOJAN REST API',
    version: 'v1',
    description: 'Intelligent Recruitment Management Platform Authoritative Backend API',
    phase: 'Phase 7 - Production Deployment, E2E Validation & Launch Readiness',
    endpoints: {
      health: '/api/v1/health',
      databaseHealth: '/api/v1/health/database',
      systemInfo: '/api/v1/system/info',
      auth: '/api/v1/auth',
      storage: '/api/v1/storage',
      candidates: '/api/v1/candidates',
      drives: '/api/v1/drives',
      applications: '/api/v1/applications',
      standby: '/api/v1/standby',
      absence: '/api/v1/absence',
      attendance: '/api/v1/attendance',
      notes: '/api/v1/notes',
      interviewers: '/api/v1/interviewers',
      notifications: '/api/v1/notifications',
      admin: '/api/v1/admin',
      analytics: '/api/v1/analytics',
      assistant: '/api/v1/assistant'
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Mount domain routes
router.use('/health', healthRoutes);
router.use('/system', systemRoutes);
router.use('/auth', authRoutes);
router.use('/storage', storageRoutes);
router.use('/admin', adminRoutes);
router.use('/candidates', candidateRoutes);
router.use('/drives', driveRoutes);
router.use('/applications', applicationRoutes);
router.use('/standby', standbyRoutes);
router.use('/absence', absenceRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notes', notesRoutes);
router.use('/interviewers', interviewerRoutes);
router.use('/interviewer', interviewerWorkspaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/assistant', assistantRoutes);

export const apiRouter = router;

