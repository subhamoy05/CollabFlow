import fs from 'fs';
import { FileAttachment } from '../models/FileAttachment.js';
import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES } from '../config/constants.js';
import { storeFile, getFilePath, deleteFile as removeDiskFile } from '../services/fileStorageService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

async function canAccessProjectFile(user, projectId) {
  if (user.role === ROLES.ADMIN) return true;

  const project = await Project.findById(projectId);
  if (!project) return false;

  const membership = await ProjectMembership.findOne({ project: projectId, user: user._id });
  if (membership) return true;

  if (!project.isPrivate) {
    const orgMembership = await OrganizationMembership.findOne({
      organization: project.organization,
      user: user._id
    });
    if (orgMembership) return true;
  }

  return false;
}

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const { projectId, taskId } = req.body;
    if (!projectId) {
      return errorResponse(res, 'Project ID is required', 400);
    }

    const hasAccess = await canAccessProjectFile(req.user, projectId);
    if (!hasAccess) {
      return errorResponse(res, 'Access denied to this project', 403);
    }

    const stored = await storeFile(req.file);

    const attachment = await FileAttachment.create({
      originalName: stored.originalName,
      fileName: stored.fileName,
      filePath: stored.filePath,
      fileSize: stored.fileSize,
      mimeType: stored.mimeType,
      uploader: req.user._id,
      project: projectId,
      task: taskId || null
    });

    const populated = await FileAttachment.findById(attachment._id).populate('uploader', 'name email avatarUrl');

    return successResponse(res, populated, 'File uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function downloadFile(req, res, next) {
  try {
    const { fileId } = req.params;
    const attachment = await FileAttachment.findById(fileId);
    if (!attachment) {
      return errorResponse(res, 'File not found', 404);
    }

    // Verify user authorization before streaming the file
    const hasAccess = await canAccessProjectFile(req.user, attachment.project);
    if (!hasAccess) {
      return errorResponse(res, 'Access denied. You do not have permission to download this file.', 403);
    }

    const diskPath = getFilePath(attachment.fileName);
    if (!diskPath || !fs.existsSync(diskPath)) {
      return errorResponse(res, 'File storage object not found on server', 404);
    }

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    return res.sendFile(diskPath);
  } catch (err) {
    next(err);
  }
}

export async function deleteAttachment(req, res, next) {
  try {
    const { fileId } = req.params;
    const attachment = await FileAttachment.findById(fileId);
    if (!attachment) {
      return errorResponse(res, 'File not found', 404);
    }

    const isUploader = attachment.uploader.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isUploader && !isAdmin) {
      const pmCheck = await ProjectMembership.findOne({
        project: attachment.project,
        user: req.user._id,
        role: ROLES.PROJECT_MANAGER
      });
      if (!pmCheck) {
        return errorResponse(res, 'Permission denied', 403);
      }
    }

    await removeDiskFile(attachment.fileName);
    await FileAttachment.deleteOne({ _id: attachment._id });

    return successResponse(res, { fileId: attachment._id }, 'File deleted');
  } catch (err) {
    next(err);
  }
}
