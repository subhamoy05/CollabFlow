import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES, ORG_ROLES } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export function requireProjectAccess(minRole = ROLES.VIEWER) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required.', 401, null, 'UNAUTHENTICATED');
      }

      const projectId = req.params.projectId || req.body.project || req.query.projectId;
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return errorResponse(res, 'Valid Project ID is required.', 400, null, 'INVALID_PROJECT_ID');
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return errorResponse(res, 'Project not found.', 404, null, 'PROJECT_NOT_FOUND');
      }

      // Global admin has system-wide project access
      if (req.user.role === ROLES.ADMIN) {
        req.project = project;
        req.projectRole = ROLES.PROJECT_MANAGER;
        return next();
      }

      // Check if user is the designated project manager
      if (project.manager && project.manager.toString() === req.user._id.toString()) {
        req.project = project;
        req.projectRole = ROLES.PROJECT_MANAGER;
        return next();
      }

      // Check explicit project membership
      const membership = await ProjectMembership.findOne({
        project: project._id,
        user: req.user._id
      });

      if (membership) {
        // Enforce minRole hierarchy
        if (minRole === ROLES.PROJECT_MANAGER && membership.role !== ROLES.PROJECT_MANAGER) {
          return errorResponse(res, 'Project Manager authorization required.', 403, null, 'PM_REQUIRED');
        }
        if (minRole === ROLES.TEAM_MEMBER && membership.role === ROLES.VIEWER) {
          return errorResponse(res, 'Viewers do not have edit permissions.', 403, null, 'VIEWER_RESTRICTED');
        }

        req.project = project;
        req.projectRole = membership.role;
        return next();
      }

      // If user is organization owner or admin, allow management access
      const orgMembership = await OrganizationMembership.findOne({
        organization: project.organization,
        user: req.user._id
      });

      if (orgMembership && (orgMembership.role === ORG_ROLES.OWNER || orgMembership.role === ORG_ROLES.ADMIN)) {
        req.project = project;
        req.projectRole = ROLES.PROJECT_MANAGER;
        return next();
      }

      // If project is public to organization members and minRole is Viewer
      if (!project.isPrivate && orgMembership) {
        if (minRole === ROLES.VIEWER) {
          req.project = project;
          req.projectRole = ROLES.VIEWER;
          return next();
        }
      }

      return errorResponse(res, 'Access denied. You are not authorized to access this project.', 403, null, 'PROJECT_ACCESS_DENIED');
    } catch (err) {
      next(err);
    }
  };
}
