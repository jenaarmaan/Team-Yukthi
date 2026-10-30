import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authenticateToken, requirePermission } from '../middleware/auth.ts';

const router = Router();

// Public Authentication Endpoints
router.post('/register-candidate', AuthController.registerCandidate);
router.post('/register-hr-admin', AuthController.registerHrAdmin);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/bootstrap-admin', AuthController.bootstrapAdmin);
router.post('/verify-token', AuthController.verifyToken);
router.post('/demo-session', AuthController.getDemoSessionToken);
router.get('/status', AuthController.getAuthStatus);

// Authenticated Endpoints
router.get('/me', authenticateToken, AuthController.getMe);
router.post('/logout', authenticateToken, AuthController.logout);
router.post('/change-password', authenticateToken, AuthController.changePassword);

// Staff Invitation & Registration Endpoints (HR Admin / Super Admin)
router.post('/register-staff', authenticateToken, AuthController.registerStaff);
router.get('/staff-members', authenticateToken, AuthController.listStaffMembers);

// Administrative RBAC Endpoints
router.post('/assign-role', authenticateToken, requirePermission('auth:manage_roles'), AuthController.assignRole);
router.get('/admin/users', authenticateToken, requirePermission('auth:view_users'), AuthController.listAdminUsers);

export const authRoutes = router;
