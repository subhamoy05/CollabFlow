import crypto from 'crypto';
import { Organization } from '../models/Organization.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { Invitation } from '../models/Invitation.js';
import { User } from '../models/User.js';
import { ROLES, ORG_ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateSecureRandomToken, hashToken } from '../utils/tokens.js';
import { logActivity } from '../services/auditService.js';
import { env } from '../config/env.js';

export async function getUserOrganizations(req, res, next) {
  try {
    const memberships = await OrganizationMembership.find({ user: req.user._id })
      .populate('organization')
      .sort({ createdAt: 1 });

    const orgs = memberships
      .filter(m => m.organization)
      .map(m => ({
        ...m.organization.toObject(),
        userRole: m.role
      }));

    return successResponse(res, orgs);
  } catch (err) {
    next(err);
  }
}

export async function createOrganization(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length < 2) {
      return errorResponse(res, 'Organization name must be at least 2 characters', 400);
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const org = await Organization.create({
      name: name.trim(),
      slug,
      description: description || '',
      owner: req.user._id,
      isPersonal: false
    });

    await OrganizationMembership.create({
      organization: org._id,
      user: req.user._id,
      role: ORG_ROLES.OWNER
    });

    await logActivity({
      actorId: req.user._id,
      action: 'ORGANIZATION_CREATED',
      entityType: 'Organization',
      entityId: org._id,
      organizationId: org._id,
      details: `Created organization ${name}`
    });

    return successResponse(res, { ...org.toObject(), userRole: ORG_ROLES.OWNER }, 'Organization created', 201);
  } catch (err) {
    next(err);
  }
}

export async function getOrganization(req, res, next) {
  try {
    return successResponse(res, {
      ...req.organization.toObject(),
      userRole: req.orgRole
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrganization(req, res, next) {
  try {
    if (req.orgRole !== ORG_ROLES.OWNER && req.orgRole !== ORG_ROLES.ADMIN && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only organization owners or admins can update settings', 403);
    }

    const { name, description, logoUrl } = req.body;
    const org = req.organization;

    if (name) org.name = name.trim();
    if (description !== undefined) org.description = description;
    if (logoUrl !== undefined) org.logoUrl = logoUrl;

    await org.save();
    return successResponse(res, org, 'Organization updated');
  } catch (err) {
    next(err);
  }
}

export async function getOrganizationMembers(req, res, next) {
  try {
    const members = await OrganizationMembership.find({ organization: req.organization._id })
      .populate('user', 'name email avatarUrl role status lastLoginAt')
      .sort({ createdAt: 1 });

    const safeMembers = members
      .filter(m => m.user)
      .map(m => ({
        id: m._id,
        user: m.user,
        role: m.role,
        joinedAt: m.createdAt
      }));

    // Also get pending invitations
    const invitations = await Invitation.find({
      organization: req.organization._id,
      isAccepted: false,
      expiresAt: { $gt: new Date() }
    }).populate('invitedBy', 'name email');

    return successResponse(res, {
      members: safeMembers,
      invitations: invitations.map(inv => ({
        id: inv._id,
        email: inv.email,
        role: inv.role,
        expiresAt: inv.expiresAt,
        invitedBy: inv.invitedBy
      }))
    });
  } catch (err) {
    next(err);
  }
}

export async function inviteMember(req, res, next) {
  try {
    if (req.orgRole !== ORG_ROLES.OWNER && req.orgRole !== ORG_ROLES.ADMIN && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only organization owners or admins can invite new members', 403);
    }

    const { email, role } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 'Valid email required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is already an org member
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const existingMember = await OrganizationMembership.findOne({
        organization: req.organization._id,
        user: existingUser._id
      });
      if (existingMember) {
        return errorResponse(res, 'User is already a member of this organization', 409);
      }
    }

    const rawToken = generateSecureRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Revoke any previous pending invite for this email in this org
    await Invitation.deleteMany({
      email: normalizedEmail,
      organization: req.organization._id,
      isAccepted: false
    });

    const invite = await Invitation.create({
      email: normalizedEmail,
      organization: req.organization._id,
      role: role || ORG_ROLES.MEMBER,
      tokenHash,
      invitedBy: req.user._id,
      expiresAt
    });

    const inviteLink = `${env.CLIENT_URL}/invitations/accept?token=${rawToken}`;
    if (!env.IS_PRODUCTION) {
      console.log(`[DevInvite] Invitation Link for ${normalizedEmail} to ${req.organization.name}: ${inviteLink}`);
    }

    return successResponse(
      res,
      {
        id: invite._id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        inviteLink: !env.IS_PRODUCTION ? inviteLink : undefined
      },
      'Invitation sent successfully',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function acceptInvitation(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 'Invitation token required', 400);
    }

    const tokenHash = hashToken(token);
    const invite = await Invitation.findOne({
      tokenHash,
      isAccepted: false,
      expiresAt: { $gt: new Date() }
    }).populate('organization');

    if (!invite) {
      return errorResponse(res, 'Invalid or expired invitation token', 400, null, 'INVALID_INVITE_TOKEN');
    }

    // Add user to organization membership
    const existingMember = await OrganizationMembership.findOne({
      organization: invite.organization._id,
      user: req.user._id
    });

    if (!existingMember) {
      await OrganizationMembership.create({
        organization: invite.organization._id,
        user: req.user._id,
        role: invite.role || ORG_ROLES.MEMBER
      });
    }

    invite.isAccepted = true;
    invite.acceptedAt = new Date();
    await invite.save();

    await logActivity({
      actorId: req.user._id,
      action: 'MEMBERSHIP_CHANGED',
      entityType: 'Organization',
      entityId: invite.organization._id,
      organizationId: invite.organization._id,
      details: `${req.user.name} joined organization via invitation`
    });

    return successResponse(res, invite.organization, 'Invitation accepted successfully');
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { memberUserId } = req.params;

    if (req.orgRole !== ORG_ROLES.OWNER && req.orgRole !== ORG_ROLES.ADMIN && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only organization owners or admins can remove members', 403);
    }

    const membership = await OrganizationMembership.findOne({
      organization: req.organization._id,
      user: memberUserId
    });

    if (!membership) {
      return errorResponse(res, 'Member not found in organization', 404);
    }

    if (membership.role === ORG_ROLES.OWNER) {
      // Check if there are other owners
      const ownerCount = await OrganizationMembership.countDocuments({
        organization: req.organization._id,
        role: ORG_ROLES.OWNER
      });
      if (ownerCount <= 1) {
        return errorResponse(res, 'Cannot remove the primary owner of the organization', 400);
      }
    }

    await OrganizationMembership.deleteOne({ _id: membership._id });

    return successResponse(res, null, 'Member removed from organization');
  } catch (err) {
    next(err);
  }
}
