import { Router } from 'express';
import { uploadFile, downloadFile, deleteAttachment } from '../controllers/fileController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadAttachment } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.post('/upload', uploadAttachment.single('file'), uploadFile);
router.get('/:fileId/download', downloadFile);
router.delete('/:fileId', deleteAttachment);

export default router;
