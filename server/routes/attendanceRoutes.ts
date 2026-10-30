import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController.ts';
import {
  authenticateToken,
  requirePermission
} from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Dynamic QR Attendance Pass (Candidate self-service or HR)
router.get('/pass/:applicationId', AttendanceController.generateDynamicPass);

// Venue Check-in Verification (QR HMAC or OTP with gate check & replay prevention)
router.post('/verify', requirePermission('attendance:verify'), AttendanceController.verifyAttendance);

// HR Desk Manual Override (present / absent)
router.post('/manual', requirePermission('attendance:verify'), AttendanceController.markAttendanceManual);

export const attendanceRoutes = router;
