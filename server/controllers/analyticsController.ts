import { Request, Response, NextFunction } from 'express';
import { RagAnalyticsService } from '../services/ragAnalyticsService.ts';
import { sendSuccess, sendError } from '../utils/response.ts';
import { logger } from '../utils/logger.ts';

export class AnalyticsController {
  /**
   * Processes natural language or transcribed voice query via the RAG Analytics Service.
   */
  public static async executeRagQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        sendError(res, 'Query string is required.', 400, 'VALIDATION_FAILED');
        return;
      }

      const actorRole = req.user?.role || 'hr_admin';
      const result = await RagAnalyticsService.executeRagQuery(query.trim(), actorRole);

      sendSuccess(res, result, 'RAG query executed successfully.');
    } catch (err: any) {
      logger.error('Error executing RAG analytics query:', err);
      sendError(res, err.message || 'Failed to process RAG analytics query.', 500, 'INTERNAL_ERROR');
    }
  }

  /**
   * Retrieves high-level analytics metrics and KPI telemetry.
   */
  public static async getAnalyticsOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorRole = req.user?.role || 'hr_admin';
      const result = await RagAnalyticsService.executeRagQuery('platform overview metrics summary', actorRole);
      sendSuccess(res, result.metrics, 'Analytics overview retrieved successfully.');
    } catch (err: any) {
      logger.error('Error retrieving analytics overview:', err);
      sendError(res, err.message || 'Failed to retrieve analytics overview.', 500, 'INTERNAL_ERROR');
    }
  }

  /**
   * Retrieves dynamically generated AI recruitment insights and recommendations.
   */
  public static async getAIInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorRole = req.user?.role || 'hr_admin';
      const result = await RagAnalyticsService.executeRagQuery('recruitment insights and actionable recommendations', actorRole);
      sendSuccess(res, {
        insights: result.insights,
        recommendations: result.recommendations,
        metrics: result.metrics,
        timestamp: result.timestamp
      }, 'AI Insights retrieved successfully.');
    } catch (err: any) {
      logger.error('Error retrieving AI insights:', err);
      sendError(res, err.message || 'Failed to retrieve AI insights.', 500, 'INTERNAL_ERROR');
    }
  }
}
