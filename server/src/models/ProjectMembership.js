import mongoose from 'mongoose';
import { ROLES } from '../config/constants.js';

const projectMembershipSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: [ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.VIEWER],
      default: ROLES.TEAM_MEMBER
    }
  },
  {
    timestamps: true
  }
);

projectMembershipSchema.index({ project: 1, user: 1 }, { unique: true });
projectMembershipSchema.index({ user: 1 });

export const ProjectMembership = mongoose.model('ProjectMembership', projectMembershipSchema);
