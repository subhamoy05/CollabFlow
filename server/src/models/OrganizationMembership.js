import mongoose from 'mongoose';
import { ORG_ROLES } from '../config/constants.js';

const organizationMembershipSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: Object.values(ORG_ROLES),
      default: ORG_ROLES.MEMBER
    }
  },
  {
    timestamps: true
  }
);

organizationMembershipSchema.index({ organization: 1, user: 1 }, { unique: true });
organizationMembershipSchema.index({ user: 1 });

export const OrganizationMembership = mongoose.model('OrganizationMembership', organizationMembershipSchema);
