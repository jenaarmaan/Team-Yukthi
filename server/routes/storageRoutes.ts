import { Router } from 'express';
import { StorageController } from '../controllers/storageController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

// Restricted URL generation (Requires User Bearer Token)
router.post('/upload-url', authenticateToken, StorageController.generateUploadUrl);
router.get('/read-url', authenticateToken, StorageController.generateReadUrl);

// Upload & Download endpoints (Authenticated via cryptographically signed HMAC parameters)
router.put('/upload', StorageController.handleUpload);
router.post('/upload', StorageController.handleUpload);
router.get('/download', StorageController.handleDownload);

export const storageRoutes = router;
