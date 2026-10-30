import { Router } from 'express';
import { StorageController } from '../controllers/storageController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

// Apply authentication to all storage operations
router.use(authenticateToken);

// Restricted URL generation
router.post('/upload-url', StorageController.generateUploadUrl);
router.get('/read-url', StorageController.generateReadUrl);

export const storageRoutes = router;
