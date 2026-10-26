import mongoose from 'mongoose';
import { Organization } from '../models/Organization.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES, ORG_ROLES } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export function requireOrgMember(roleRequired = null) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required.', 401, null, 'UNAUTHENTICATED');
      }

      const orgId = req.params.organizationId || req.body.organization || req.query.organizationId;
      if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
        return errorResponse(res, 'Valid Organization ID is required.', 400, null, 'INVALID_ORG_ID');
      }

      // Global admin has system-wide org access
      if (req.user.role === ROLES.ADMIN) {
        const org = await Organization.findById(orgId);
        if (!org) {
          return errorResponse(res, 'Organization not found.', 404, null, 'ORG_NOT_FOUND');
        }
        req.organization = org;
        req.orgRole = ORG_ROLES.OWNER;
        return next();
      }

      const membership = await OrganizationMembership.findOne({
        organization: orgId,
        user: req.user._id
      }).populate('organization');

      if (!membership) {
        return errorResponse(res, 'Access denied. You are not a member of this organization.', 403, null, 'NOT_ORG_MEMBER');
      }

      if (roleRequired === ORG_ROLES.OWNER && membership.role !== ORG_ROLES.OWNER) {
        return errorResponse(res, 'Action restricted to organization owners only.', 403, null, 'OWNER_ONLY');
      }

      if (roleRequired === ORG_ROLES.ADMIN && membership.role !== ORG_ROLES.OWNER && membership.role !== ORG_ROLES.ADMIN) {
        return errorResponse(res, 'Action restricted to organization administrators only.', 403, null, 'ORG_ADMIN_ONLY');
      }

      req.organization = membership.organization;
      req.orgRole = membership.role;
      next();
    } catch (err) {
      next(err);
    }
  };
}
