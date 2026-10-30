import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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
const UPLOADS_ROOT = path.resolve(process.cwd(), 'data', 'uploads');

if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}

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

    // Cryptographic tamper-proof backend-mediated upload endpoint
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

    const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
    hmac.update(`read:${storagePath}:${expiresMs}`);
    const token = hmac.digest('hex');

    return {
      downloadUrl: `${config.appUrl}/api/v1/storage/download?path=${encodeURIComponent(storagePath)}&expires=${expiresMs}&token=${token}`,
      expiresAt,
      isPrivate: true
    };
  }

  /**
   * Verifies the authenticity of an upload token.
   */
  public static verifyUploadToken(storagePath: string, mimeType: string, expires: string, candidateId: string, token: string): boolean {
    if (Date.now() > parseInt(expires, 10)) {
      return false;
    }
    const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
    hmac.update(`${storagePath}:${mimeType}:${expires}:${candidateId}`);
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }

  /**
   * Verifies the authenticity of a download token.
   */
  public static verifyReadToken(storagePath: string, expires: string, token: string): boolean {
    if (Date.now() > parseInt(expires, 10)) {
      return false;
    }
    const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
    hmac.update(`read:${storagePath}:${expires}`);
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }

  /**
   * Saves uploaded binary payload to local disk.
   */
  public static async saveUploadedFile(storagePath: string, fileBuffer: Buffer): Promise<string> {
    const safePath = path.normalize(storagePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.resolve(UPLOADS_ROOT, safePath);
    const parentDir = path.dirname(fullPath);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    await fs.promises.writeFile(fullPath, fileBuffer);
    logger.info(`File successfully saved to local storage: ${fullPath}`);
    return fullPath;
  }

  /**
   * Retrieves local absolute path for stored file.
   */
  public static getLocalFilePath(storagePath: string): string | null {
    const safePath = path.normalize(storagePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.resolve(UPLOADS_ROOT, safePath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
    return null;
  }
}
