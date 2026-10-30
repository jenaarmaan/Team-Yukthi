import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/healthService.ts';
import { sendSuccess } from '../utils/response.ts';

export class SystemController {
  public static getSystemInfo(req: Request, res: Response, next: NextFunction): void {
    try {
      const info = HealthService.getSystemInfo();
      sendSuccess(res, info, 'System specifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
