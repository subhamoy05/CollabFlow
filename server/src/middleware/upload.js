import multer from 'multer';
import { ALLOWED_MIME_TYPES } from '../services/fileStorageService.js';
import { env } from '../config/env.js';

const storage = multer.memoryStorage();

export const uploadAttachment = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type '${file.mimetype}' is not permitted.`));
    }
  }
});
