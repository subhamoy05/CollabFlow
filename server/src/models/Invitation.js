import mongoose from 'mongoose';
import { ROLES } from '../config/constants.js';

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.TEAM_MEMBER
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    acceptedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

invitationSchema.index({ email: 1, organization: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model('Invitation', invitationSchema);
