import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/healthService.ts';
import { sendSuccess } from '../utils/response.ts';

export class HealthController {
  public static getHealth(req: Request, res: Response, next: NextFunction): void {
    try {
      const health = HealthService.getSystemHealth();
      sendSuccess(res, health, 'System is healthy and operational');
    } catch (error) {
      next(error);
    }
  }

  public static async getDatabaseHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbHealth = await HealthService.getDatabaseHealth();
      sendSuccess(res, dbHealth, 'Database status retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
