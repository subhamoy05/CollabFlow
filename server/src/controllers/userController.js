import { User } from '../models/User.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getMe(req, res, next) {
  try {
    return successResponse(res, req.user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name, avatarUrl, preferences } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();
    return successResponse(res, user.toSafeJSON(), 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { search, organizationId } = req.query;

    let userIds = null;

    if (req.user.role !== ROLES.ADMIN) {
      if (organizationId) {
        // Only members of this specific organization
        const orgMemberships = await OrganizationMembership.find({ organization: organizationId });
        userIds = orgMemberships.map(m => m.user);
      } else {
        // Find all organizations the user belongs to
        const myOrgs = await OrganizationMembership.find({ user: req.user._id });
        const orgIds = myOrgs.map(m => m.organization);

        // Find all users in those organizations
        const orgMemberships = await OrganizationMembership.find({ organization: { $in: orgIds } });
        userIds = orgMemberships.map(m => m.user);
      }
    }

    const query = { status: 'active' };
    if (userIds) {
      query._id = { $in: userIds };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('name email avatarUrl role status createdAt').limit(50);
    return successResponse(res, users);
  } catch (err) {
    next(err);
  }
}
