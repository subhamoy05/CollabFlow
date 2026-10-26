import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sanitize from 'sanitize-filename';
import { env } from '../config/env.js';

// Ensure upload directory exists safely
const uploadDir = path.resolve(env.UPLOAD_DIR);
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  // Gracefully handle sandbox or transient permission issues
  if (err.code !== 'EEXIST') {
    console.warn(`[FileStorage] Notice: upload directory creation deferred (${err.message})`);
  }
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/json',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export async function storeFile(file) {
  // file from multer: { originalname, buffer or path, mimetype, size }
  const cleanOriginal = sanitize(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = path.extname(cleanOriginal);
  const randomHex = crypto.randomBytes(16).toString('hex');
  const storedFileName = `${Date.now()}-${randomHex}${ext}`;
  const targetPath = path.join(uploadDir, storedFileName);

  // Path traversal check
  const normalizedTarget = path.normalize(targetPath);
  if (!normalizedTarget.startsWith(uploadDir)) {
    throw new Error('Path traversal attempt detected');
  }

  if (file.buffer) {
    await fs.promises.writeFile(targetPath, file.buffer);
  } else if (file.path && file.path !== targetPath) {
    await fs.promises.rename(file.path, targetPath);
  }

  return {
    originalName: cleanOriginal,
    fileName: storedFileName,
    filePath: targetPath,
    fileSize: file.size,
    mimeType: file.mimetype
  };
}

export function getFilePath(fileName) {
  const safeName = path.basename(fileName);
  const resolved = path.join(uploadDir, safeName);
  if (!resolved.startsWith(uploadDir) || !fs.existsSync(resolved)) {
    return null;
  }
  return resolved;
}

export async function deleteFile(fileName) {
  const fullPath = getFilePath(fileName);
  if (fullPath && fs.existsSync(fullPath)) {
    await fs.promises.unlink(fullPath);
  }
}
