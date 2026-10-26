import crypto from 'crypto';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { Organization } from '../models/Organization.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES, ORG_ROLES } from '../config/constants.js';
import { env } from '../config/env.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateSecureRandomToken
} from '../utils/tokens.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/auditService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'lax',
  path: '/'
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('cf_access_token', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000 // 15 mins
  });
  if (refreshToken) {
    res.cookie('cf_refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}

function clearAuthCookies(res) {
  res.clearCookie('cf_access_token', { ...COOKIE_OPTIONS });
  res.clearCookie('cf_refresh_token', { ...COOKIE_OPTIONS });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 409, null, 'EMAIL_EXISTS');
    }

    const passwordHash = await User.hashPassword(password);
    // Never allow registration as Admin through public registration
    const user = await User.create({
      name: (name || '').trim(),
      email: normalizedEmail,
      passwordHash,
      role: ROLES.TEAM_MEMBER,
      status: 'active'
    });

    // Auto-create a default personal workspace for the user
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const org = await Organization.create({
      name: `${name}'s Workspace`,
      slug,
      owner: user._id,
      isPersonal: true
    });

    await OrganizationMembership.create({
      organization: org._id,
      user: user._id,
      role: ORG_ROLES.OWNER
    });

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    await RefreshSession.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    setAuthCookies(res, accessToken, refreshToken);

    return successResponse(
      res,
      {
        user: user.toSafeJSON(),
        accessToken,
        defaultOrganization: org
      },
      'Registration successful',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401, null, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 'Your account has been suspended. Please contact an administrator.', 403, null, 'ACCOUNT_SUSPENDED');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401, null, 'INVALID_CREDENTIALS');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    await RefreshSession.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    setAuthCookies(res, accessToken, refreshToken);

    // Fetch user's organizations
    const memberships = await OrganizationMembership.find({ user: user._id }).populate('organization');
    const organizations = memberships
      .filter(m => m.organization)
      .map(m => ({
        ...m.organization.toObject(),
        userRole: m.role
      }));

    return successResponse(
      res,
      {
        user: user.toSafeJSON(),
        accessToken,
        organizations
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.cf_refresh_token;
    if (refreshToken) {
      const hashed = hashToken(refreshToken);
      await RefreshSession.updateOne({ tokenHash: hashed }, { isRevoked: true, revokedAt: new Date() });
    }

    clearAuthCookies(res);
    return successResponse(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    const memberships = await OrganizationMembership.find({ user: req.user._id }).populate('organization');
    const organizations = memberships
      .filter(m => m.organization)
      .map(m => ({
        ...m.organization.toObject(),
        userRole: m.role
      }));

    return successResponse(res, {
      user: req.user.toSafeJSON(),
      organizations
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.cf_refresh_token || req.body.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 401, null, 'NO_REFRESH_TOKEN');
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      clearAuthCookies(res);
      return errorResponse(res, 'Invalid or expired refresh token', 401, null, 'REFRESH_EXPIRED');
    }

    const hashed = hashToken(refreshToken);
    const session = await RefreshSession.findOne({ tokenHash: hashed, isRevoked: false });
    if (!session || new Date() > session.expiresAt) {
      clearAuthCookies(res);
      return errorResponse(res, 'Session expired or revoked', 401, null, 'SESSION_INVALID');
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.status === 'suspended') {
      clearAuthCookies(res);
      return errorResponse(res, 'User unavailable or suspended', 403, null, 'ACCOUNT_UNAVAILABLE');
    }

    const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });
    setAuthCookies(res, newAccessToken);

    return successResponse(res, { accessToken: newAccessToken, user: user.toSafeJSON() }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always respond with success to prevent user enumeration attacks
    if (!user) {
      return successResponse(
        res,
        null,
        'If an account exists with that email, a password reset link has been dispatched.'
      );
    }

    // Invalidate existing active reset tokens for this user
    await PasswordResetToken.updateMany({ user: user._id, isUsed: false }, { isUsed: true });

    const rawToken = generateSecureRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;

    // In development or when email service is off, log the link safely to server console for testing
    if (!env.IS_PRODUCTION) {
      console.log(`[DevAuth] Password Reset Link for ${email}: ${resetUrl}`);
    }

    return successResponse(
      res,
      null,
      'If an account exists with that email, a password reset link has been dispatched.'
    );
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const tokenHash = hashToken(token);

    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return errorResponse(res, 'Invalid or expired password reset link.', 400, null, 'INVALID_RESET_TOKEN');
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      return errorResponse(res, 'User account not found.', 404, null, 'USER_NOT_FOUND');
    }

    user.passwordHash = await User.hashPassword(password);
    await user.save();

    resetRecord.isUsed = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Revoke all existing sessions for security
    await RefreshSession.updateMany({ user: user._id }, { isRevoked: true, revokedAt: new Date() });

    await logActivity({
      actorId: user._id,
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: user._id,
      details: 'Password was successfully reset'
    });

    return successResponse(res, null, 'Password reset successful. Please log in with your new password.');
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, avatarUrl, preferences } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (preferences) {
      user.preferences = { ...user.preferences.toObject(), ...preferences };
    }

    await user.save();

    return successResponse(res, user.toSafeJSON(), 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}
