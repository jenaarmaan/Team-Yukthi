import crypto from 'crypto';
import { adminStorage, firebaseConfig, getFirebaseGatewayStatus } from '../config/firebase.ts';
import { config } from '../config/env.ts';
import { logger } from '../utils/logger.ts';

export interface UploadUrlRequest {
  candidateId: string;
  driveId: string;
  documentType: 'resume' | 'absence_justification';
  originalFileName: string;
  mimeType: string;
  fileSizeBytes?: number;
}

export interface UploadUrlResponse {
  storagePath: string;
  uploadUrl: string;
  expiresAt: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
  isPrivate: true;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  expiresAt: string;
  isPrivate: true;
}

const SIGNING_SECRET = process.env.STORAGE_SIGNING_SECRET || 'niyojan-storage-signing-secret-2026';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export class StorageService {
  /**
   * Generates a restricted, short-lived upload URL for candidate documents.
   * Resumes and medical notes are never made public.
   */
  public static async generateRestrictedUploadUrl(req: UploadUrlRequest): Promise<UploadUrlResponse> {
    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(req.mimeType)) {
      throw new Error(`Invalid file type "${req.mimeType}". Only PDF and JPEG/PNG images are accepted.`);
    }

    // 2. Validate declared size if present
    if (req.fileSizeBytes && req.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds maximum limit of 5MB (${Math.round(req.fileSizeBytes / 1024 / 1024)}MB).`);
    }

    // 3. Construct isolated private path
    const sanitizedExt = req.originalFileName.split('.').pop()?.toLowerCase() || 'pdf';
    const uniqueFileId = `${crypto.randomUUID()}.${sanitizedExt}`;
    const storagePath = `documents/${req.driveId}/${req.candidateId}/${req.documentType}/${uniqueFileId}`;
    const expiresMs = Date.now() + 15 * 60 * 1000; // 15 minutes TTL
    const expiresAt = new Date(expiresMs).toISOString();

    const gateway = getFirebaseGatewayStatus();

    // If full service account credentials with private key are available, sign V4 URL
    if (gateway.hasServiceAccountCredentials) {
      try {
        const bucket = adminStorage.bucket();
        const file = bucket.file(storagePath);
        const [signedUrl] = await file.getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: expiresMs,
          contentType: req.mimeType
        });

        logger.info(`Generated GCS V4 signed upload URL for ${storagePath}`);
        return {
          storagePath,
          uploadUrl: signedUrl,
          expiresAt,
          method: 'PUT',
          headers: { 'Content-Type': req.mimeType },
          isPrivate: true
        };
      } catch (err) {
        logger.warn('GCS direct V4 signing unavailable; falling back to secure backend proxy URL', { error: String(err) });
      }
    }

    // Fallback to cryptographic tamper-proof backend-mediated upload endpoint
    const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
    hmac.update(`${storagePath}:${req.mimeType}:${expiresMs}:${req.candidateId}`);
    const token = hmac.digest('hex');

    const backendUploadUrl = `${config.appUrl}/api/v1/storage/upload?path=${encodeURIComponent(storagePath)}&mimeType=${encodeURIComponent(req.mimeType)}&expires=${expiresMs}&token=${token}&candidateId=${encodeURIComponent(req.candidateId)}`;

    return {
      storagePath,
      uploadUrl: backendUploadUrl,
      expiresAt,
      method: 'PUT',
      headers: { 'Content-Type': req.mimeType },
      isPrivate: true
    };
  }

  /**
   * Generates a restricted, short-lived read URL for HR review.
   * Access expires after 15 minutes.
   */
  public static async generateRestrictedReadUrl(storagePath: string): Promise<DownloadUrlResponse> {
    const expiresMs = Date.now() + 15 * 60 * 1000;
    const expiresAt = new Date(expiresMs).toISOString();
    const gateway = getFirebaseGatewayStatus();

    if (gateway.hasServiceAccountCredentials) {
      try {
        const bucket = adminStorage.bucket();
        const file = bucket.file(storagePath);
        const [signedUrl] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: expiresMs
        });

        return {
          downloadUrl: signedUrl,
          expiresAt,
          isPrivate: true
        };
      } catch (err) {
        logger.warn('GCS direct V4 read signing unavailable; falling back to secure proxy URL', { error: String(err) });
      }
    }

    const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
    hmac.update(`read:${storagePath}:${expiresMs}`);
    const token = hmac.digest('hex');

    return {
      downloadUrl: `${config.appUrl}/api/v1/storage/download?path=${encodeURIComponent(storagePath)}&expires=${expiresMs}&token=${token}`,
      expiresAt,
      isPrivate: true
    };
  }
}
