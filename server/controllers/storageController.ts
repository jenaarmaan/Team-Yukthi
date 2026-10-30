import { Request, Response, NextFunction } from 'express';
import { StorageService } from '../services/storageService.ts';
import { sendSuccess, sendError } from '../utils/response.ts';

export class StorageController {
  public static async generateUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { candidateId, driveId, documentType, originalFileName, mimeType, fileSizeBytes } = req.body;

      if (!candidateId || !driveId || !documentType || !originalFileName || !mimeType) {
        sendError(res, 'Missing required fields: candidateId, driveId, documentType, originalFileName, mimeType', 400);
        return;
      }

      // Security check: Candidates can only generate upload URLs for their own documents
      if (req.user?.role === 'candidate' && req.user.uid !== candidateId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'auth/forbidden-ownership',
            message: 'Access denied: Candidates cannot upload documents for other candidates.'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await StorageService.generateRestrictedUploadUrl({
        candidateId,
        driveId,
        documentType,
        originalFileName,
        mimeType,
        fileSizeBytes
      });

      sendSuccess(res, result, 'Restricted upload URL generated successfully');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to generate upload URL', 400);
    }
  }

  public static async generateReadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storagePath } = req.query;

      if (!storagePath || typeof storagePath !== 'string') {
        sendError(res, 'Missing storagePath query parameter', 400);
        return;
      }

      // Security check: Candidates can only access their own private documents
      if (req.user?.role === 'candidate' && !storagePath.includes(`/${req.user.uid}/`)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'auth/forbidden-ownership',
            message: 'Access denied: Candidates cannot read documents belonging to other candidates.'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await StorageService.generateRestrictedReadUrl(storagePath);
      sendSuccess(res, result, 'Restricted read URL generated successfully');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to generate read URL', 400);
    }
  }
}
