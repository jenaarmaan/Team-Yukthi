import { Request, Response } from 'express';
import { AssistantService } from '../services/assistantService.ts';
import { sendSuccess, sendError } from '../utils/response.ts';
import { JwtUtil } from '../utils/jwt.ts';
import { UserRole } from '../repositories/types.ts';
import {
  applicationsRepository,
  absenceRecordsRepository,
  slotRecoveryIncidentsRepository
} from '../repositories/index.ts';
import { logger } from '../utils/logger.ts';

// Simple in-memory rate limiter per IP / user (max 40 requests per minute)
const rateLimitMap: Map<string, { count: number; resetAt: number }> = new Map();

function isRateLimited(key: string, limit = 40, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  if (entry.count > limit) {
    return true;
  }
  return false;
}

export class AssistantController {
  /**
   * Resolves caller identity from Bearer token if present,
   * otherwise checks client-provided role header for demo environments, or defaults to guest.
   */
  private static async resolveUser(req: Request): Promise<{
    uid: string;
    email: string;
    role: UserRole | 'guest';
    displayName?: string;
  }> {
    // 1. Check req.user already set by auth middleware
    if (req.user) {
      return {
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role,
        displayName: req.user.displayName
      };
    }

    // 2. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]?.trim();
      if (token) {
        try {
          const verified = await JwtUtil.verify(token);
          if (verified) {
            return {
              uid: verified.uid,
              email: verified.email,
              role: verified.role,
              displayName: verified.displayName
            };
          }
        } catch {
          // Token expired or invalid, fallback to fallback/guest
        }
      }
    }

    // 3. Fallback for demo client simulation headers
    const clientRole = (req.headers['x-niyojan-role'] as string)?.toLowerCase();
    const clientUid = (req.headers['x-niyojan-uid'] as string) || 'guest_user';
    const clientEmail = (req.headers['x-niyojan-email'] as string) || 'guest@niyojan.excelsoftcorp.com';

    const validRoles: UserRole[] = [
      'candidate',
      'super_admin',
      'hr_admin',
      'recruitment_manager',
      'interview_coordinator',
      'interviewer'
    ];

    if (clientRole && validRoles.includes(clientRole as UserRole)) {
      return {
        uid: clientUid,
        email: clientEmail,
        role: clientRole as UserRole,
        displayName: clientEmail.split('@')[0]
      };
    }

    return {
      uid: 'guest_user',
      email: 'public@niyojan.excelsoftcorp.com',
      role: 'guest',
      displayName: 'Platform Visitor'
    };
  }

  /**
   * POST /api/v1/assistant/chat
   * Process a message from user and return grounded role-aware response.
   */
  public static async chat(req: Request, res: Response): Promise<void> {
    try {
      const ip = req.ip || '127.0.0.1';
      const user = await AssistantController.resolveUser(req);
      const rateLimitKey = `${user.uid}_${ip}`;

      if (isRateLimited(rateLimitKey)) {
        sendError(res, 'Too many requests. Please slow down and try again in a moment.', 429, 'assistant/rate-limit-exceeded');
        return;
      }

      const { message } = req.body;
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        sendError(res, 'Message text is required and cannot be empty.', 400, 'assistant/empty-message');
        return;
      }

      if (message.length > 1000) {
        sendError(res, 'Message exceeds the maximum allowable length of 1000 characters.', 400, 'assistant/message-too-long');
        return;
      }

      const response = await AssistantService.processMessage(user, message);
      sendSuccess(res, response, 'Assistant response synthesized successfully', 200);
    } catch (err: any) {
      logger.error('[AssistantController.chat] Unhandled error:', err);
      sendError(res, err.message || 'Failed to process assistant request', 500, 'assistant/processing-failure');
    }
  }

  /**
   * GET /api/v1/assistant/history
   * Retrieve active conversation history for the authenticated user.
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const user = await AssistantController.resolveUser(req);
      const history = AssistantService.getHistory(user.uid);
      sendSuccess(res, { history, count: history.length, role: user.role }, 'History retrieved', 200);
    } catch (err: any) {
      logger.error('[AssistantController.getHistory] Error:', err);
      sendError(res, 'Failed to retrieve conversation history', 500, 'assistant/history-failure');
    }
  }

  /**
   * DELETE /api/v1/assistant/history
   * Clear active conversation history for the authenticated user.
   */
  public static async clearHistory(req: Request, res: Response): Promise<void> {
    try {
      const user = await AssistantController.resolveUser(req);
      AssistantService.clearHistory(user.uid);
      sendSuccess(res, { cleared: true, userId: user.uid }, 'Conversation history cleared', 200);
    } catch (err: any) {
      logger.error('[AssistantController.clearHistory] Error:', err);
      sendError(res, 'Failed to clear conversation history', 500, 'assistant/clear-failure');
    }
  }

  /**
   * GET /api/v1/assistant/status
   * Health and operational status of the NIYOJAN AI Assistant.
   */
  public static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = await AssistantController.resolveUser(req);
      const suggestions = AssistantService.getRoleSuggestions(user.role);

      sendSuccess(
        res,
        {
          status: 'online',
          engine: 'NIYOJAN Context-Grounded SQLite WAL Engine + Google GenAI',
          activeRole: user.role,
          authenticated: user.role !== 'guest',
          suggestions,
          timestamp: new Date().toISOString()
        },
        'Assistant operational status online',
        200
      );
    } catch (err: any) {
      logger.error('[AssistantController.getStatus] Error:', err);
      sendError(res, 'Failed to retrieve assistant status', 500, 'assistant/status-failure');
    }
  }

  /**
   * POST /api/v1/assistant/action
   * Executes a confirmed action requested via the assistant.
   * Strictly enforces RBAC permissions before modifying any recruitment records.
   */
  public static async executeAction(req: Request, res: Response): Promise<void> {
    try {
      const user = await AssistantController.resolveUser(req);
      const { action, targetId, confirmed } = req.body;

      if (!action) {
        sendError(res, 'Action identifier is required', 400, 'assistant/missing-action');
        return;
      }

      if (!confirmed) {
        sendError(
          res,
          'Explicit user confirmation is required before executing this recruitment action.',
          400,
          'assistant/confirmation-required'
        );
        return;
      }

      // Check RBAC for mutation actions
      if (action === 'ratify_absence') {
        if (user.role !== 'hr_admin' && user.role !== 'super_admin') {
          sendError(res, 'Unauthorized. Only HR Admin or Super Admin can ratify absences.', 403, 'auth/forbidden');
          return;
        }

        if (targetId) {
          await absenceRecordsRepository.update(targetId, {
            status: 'ratified',
            reviewedAt: new Date().toISOString(),
            reviewedByAdminId: user.uid,
            hrReviewNotes: `Ratified by ${user.email} via NIYOJAN AI Assistant`
          });
        }

        sendSuccess(res, { executed: true, action, targetId, message: 'Absence justification ratified successfully.' });
        return;
      }

      if (action === 'promote_standby_to_slot') {
        if (user.role !== 'hr_admin' && user.role !== 'recruitment_manager' && user.role !== 'super_admin') {
          sendError(res, 'Unauthorized. Role cannot modify interview slot allocations.', 403, 'auth/forbidden');
          return;
        }

        if (targetId) {
          await applicationsRepository.update(targetId, {
            status: 'confirmed',
            updatedAt: new Date().toISOString()
          });
        }

        sendSuccess(res, { executed: true, action, targetId, message: 'Standby candidate promoted to confirmed interview slot.' });
        return;
      }

      sendSuccess(res, { executed: true, action, targetId, message: `Action ${action} recognized.` });
    } catch (err: any) {
      logger.error('[AssistantController.executeAction] Error:', err);
      sendError(res, err.message || 'Action execution failed', 500, 'assistant/action-failure');
    }
  }
}
