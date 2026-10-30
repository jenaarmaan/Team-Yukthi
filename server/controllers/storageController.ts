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

  public static async handleUpload(req: Request, res: Response): Promise<void> {
    try {
      const { path: storagePath, mimeType, expires, candidateId, token } = req.query;

      if (!storagePath || !mimeType || !expires || !candidateId || !token) {
        sendError(res, 'Missing required query parameters for storage upload', 400);
        return;
      }

      const isValid = StorageService.verifyUploadToken(
        String(storagePath),
        String(mimeType),
        String(expires),
        String(candidateId),
        String(token)
      );

      if (!isValid) {
        res.status(403).json({
          success: false,
          error: { code: 'storage/forbidden-token', message: 'Upload token is invalid, forged, or expired.' }
        });
        return;
      }

      // Collect raw body chunks
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await StorageService.saveUploadedFile(String(storagePath), buffer);
          res.status(200).json({ success: true, message: 'File uploaded successfully to local storage.' });
        } catch (err: any) {
          sendError(res, 'Failed to save file to local storage', 500);
        }
      });
    } catch (err: any) {
      sendError(res, err.message || 'Upload processing error', 500);
    }
  }

  public static async handleDownload(req: Request, res: Response): Promise<void> {
    try {
      const { path: storagePath, expires, token } = req.query;

      if (!storagePath || !expires || !token) {
        sendError(res, 'Missing required query parameters for storage download', 400);
        return;
      }

      const isValid = StorageService.verifyReadToken(String(storagePath), String(expires), String(token));
      if (!isValid) {
        res.status(403).json({
          success: false,
          error: { code: 'storage/forbidden-token', message: 'Download token is invalid, forged, or expired.' }
        });
        return;
      }

      const localPath = StorageService.getLocalFilePath(String(storagePath));
      if (!localPath) {
        res.status(404).json({
          success: false,
          error: { code: 'storage/file-not-found', message: 'Requested document not found in storage.' }
        });
        return;
      }

      res.sendFile(localPath);
    } catch (err: any) {
      sendError(res, err.message || 'Download processing error', 500);
    }
  }
}
