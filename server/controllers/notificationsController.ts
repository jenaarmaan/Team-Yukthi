import { Request, Response } from 'express';
import { notificationsRepository } from '../repositories/index.ts';
import { sendSuccess, sendBadRequest, sendNotFound } from '../utils/response.ts';

export class NotificationsController {
  public static async getMyNotifications(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const notifs = await notificationsRepository.findByField('candidateId', candidateId!);
    // Sort descending by timestamp/id
    sendSuccess(res, notifs, 'Candidate notifications retrieved.');
  }

  public static async getUnreadCount(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const notifs = await notificationsRepository.findByField('candidateId', candidateId!);
    const unreadCount = notifs.filter((n) => !n.isRead).length;
    sendSuccess(res, { unreadCount }, 'Unread notification count retrieved.');
  }

  public static async markAsRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const notif = await notificationsRepository.findById(id);
    if (!notif) {
      sendNotFound(res, 'Notification not found.');
      return;
    }

    await notificationsRepository.update(id, { isRead: true });
    sendSuccess(res, { id, isRead: true }, 'Notification marked as read.');
  }

  public static async markAllAsRead(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const notifs = await notificationsRepository.findByField('candidateId', candidateId!);
    for (const n of notifs) {
      if (!n.isRead) {
        await notificationsRepository.update(n.id, { isRead: true });
      }
    }
    sendSuccess(res, { markedCount: notifs.length }, 'All notifications marked as read.');
  }

  public static async sendNotification(req: Request, res: Response): Promise<void> {
    const body = req.body;
    if (!body.candidateId || !body.title || !body.message) {
      sendBadRequest(res, 'candidateId, title, and message are required.');
      return;
    }

    const notifId = 'notif_' + Date.now();
    const newNotif = {
      id: notifId,
      candidateId: body.candidateId,
      type: body.type || 'system_announcement',
      title: body.title,
      message: body.message,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: body.deliveryChannel || 'in_app',
      isSimulatedExternal: Boolean(body.deliveryChannel && body.deliveryChannel !== 'in_app'),
      actionRoute: body.actionRoute
    };

    await notificationsRepository.create(notifId, newNotif);
    sendSuccess(res, newNotif, 'Notification dispatched successfully.', 201);
  }
}
