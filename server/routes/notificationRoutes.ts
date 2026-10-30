import { Router } from 'express';
import { NotificationsController } from '../controllers/notificationsController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

// Candidate in-app notifications
router.get('/my', NotificationsController.getMyNotifications);
router.get('/unread-count', NotificationsController.getUnreadCount);
router.put('/:id/read', NotificationsController.markAsRead);
router.put('/read-all', NotificationsController.markAllAsRead);
router.post('/send', NotificationsController.sendNotification);

export const notificationRoutes = router;
