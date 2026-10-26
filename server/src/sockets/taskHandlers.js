import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES } from '../config/constants.js';
import { addProjectPresence, removeProjectPresence } from './presenceHandlers.js';

export async function canUserAccessProject(user, projectId) {
  if (user.role === ROLES.ADMIN) return true;

  if (!mongoose.Types.ObjectId.isValid(projectId)) return false;

  const project = await Project.findById(projectId);
  if (!project) return false;

  if (project.manager && project.manager.toString() === user._id.toString()) return true;

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

export function registerTaskHandlers(io, socket) {
  socket.on('project:join', async ({ projectId }, callback) => {
    try {
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        if (typeof callback === 'function') callback({ success: false, error: 'Invalid project ID' });
        return;
      }

      const hasAccess = await canUserAccessProject(socket.user, projectId);
      if (!hasAccess) {
        if (typeof callback === 'function') callback({ success: false, error: 'Unauthorized project room access' });
        return;
      }

      const room = `project:${projectId}`;
      socket.join(room);
      addProjectPresence(io, projectId, socket.user._id.toString());

      if (typeof callback === 'function') {
        callback({ success: true, room });
      }
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('project:leave', ({ projectId }) => {
    if (projectId) {
      socket.leave(`project:${projectId}`);
      removeProjectPresence(io, projectId, socket.user._id.toString());
    }
  });
}
