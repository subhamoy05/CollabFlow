import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Organization } from '../models/Organization.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { SystemSetting } from '../models/SystemSetting.js';
import { ROLES, TASK_STATUSES, PROJECT_STATUSES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/auditService.js';

export async function getAdminOverview(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    const totalOrgs = await Organization.countDocuments();

    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: PROJECT_STATUSES.ACTIVE });
    const completedProjects = await Project.countDocuments({ status: PROJECT_STATUSES.COMPLETED });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: TASK_STATUSES.DONE });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: TASK_STATUSES.DONE },
      dueDate: { $ne: null, $lt: new Date() }
    });

    // Role distribution
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const roleDistribution = Object.values(ROLES).map(role => {
      const match = roleStats.find(r => r._id === role);
      return { role, count: match ? match.count : 0 };
    });

    // Project status distribution
    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const projectStatusDistribution = Object.values(PROJECT_STATUSES).map(status => {
      const match = statusStats.find(s => s._id === status);
      return { status, count: match ? match.count : 0 };
    });

    // Recent audit logs
    const recentAuditLogs = await ActivityLog.find()
      .populate('actor', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    return successResponse(res, {
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalOrgs,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        overdueTasks
      },
      roleDistribution,
      projectStatusDistribution,
      recentAuditLogs
    });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, users, 'Users retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (req.user._id.toString() === userId && status === 'suspended') {
      return errorResponse(res, 'You cannot suspend your own administrator account.', 400);
    }

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 'User not found', 404);

    user.status = status;
    await user.save();

    if (status === 'suspended') {
      // Revoke all active sessions
      await RefreshSession.updateMany({ user: user._id }, { isRevoked: true, revokedAt: new Date() });
    }

    await logActivity({
      actorId: req.user._id,
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      entityType: 'User',
      entityId: user._id,
      details: `${status === 'suspended' ? 'Suspended' : 'Activated'} user ${user.name} (${user.email})`
    });

    return successResponse(res, user.toSafeJSON(), `User ${status === 'suspended' ? 'suspended' : 'activated'}`);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 'User not found', 404);

    // Prevent removing the last admin
    if (user.role === ROLES.ADMIN && role !== ROLES.ADMIN) {
      const adminCount = await User.countDocuments({ role: ROLES.ADMIN, status: 'active' });
      if (adminCount <= 1) {
        return errorResponse(res, 'Cannot demote the last remaining active Administrator.', 400);
      }
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    await logActivity({
      actorId: req.user._id,
      action: 'ROLE_CHANGED',
      entityType: 'User',
      entityId: user._id,
      details: `Changed role of ${user.name} from ${previousRole} to ${role}`
    });

    return successResponse(res, user.toSafeJSON(), 'User role updated');
  } catch (err) {
    next(err);
  }
}

export async function getProjectsAdmin(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate('manager', 'name email avatarUrl')
      .populate('organization', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, projects, 'Admin projects retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrganizationsAdmin(req, res, next) {
  try {
    const orgs = await Organization.find()
      .populate('owner', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    const orgIds = orgs.map(o => o._id);
    const memberCounts = await OrganizationMembership.aggregate([
      { $match: { organization: { $in: orgIds } } },
      { $group: { _id: '$organization', count: { $sum: 1 } } }
    ]);
    const projectCounts = await Project.aggregate([
      { $match: { organization: { $in: orgIds } } },
      { $group: { _id: '$organization', count: { $sum: 1 } } }
    ]);

    const enriched = orgs.map(org => {
      const mMatch = memberCounts.find(m => m._id.toString() === org._id.toString());
      const pMatch = projectCounts.find(p => p._id.toString() === org._id.toString());
      return {
        ...org.toObject(),
        memberCount: mMatch ? mMatch.count : 0,
        projectCount: pMatch ? pMatch.count : 0
      };
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req, res, next) {
  try {
    const { entityType, page = 1, limit = 50 } = req.query;

    const query = {};
    if (entityType && entityType !== 'all') {
      query.entityType = entityType;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .populate('actor', 'name email avatarUrl role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, logs, 'Audit logs retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    next(err);
  }
}

export async function getSystemSettings(req, res, next) {
  try {
    const settings = await SystemSetting.find();
    const settingsMap = {
      allowRegistration: true,
      requireEmailVerification: false,
      maxUploadSizeMb: 10,
      maintenanceMode: false,
      enableTaskComments: true,
      defaultUserRole: ROLES.TEAM_MEMBER
    };

    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return successResponse(res, settingsMap);
  } catch (err) {
    next(err);
  }
}

export async function updateSystemSettings(req, res, next) {
  try {
    const allowedKeys = [
      'allowRegistration',
      'requireEmailVerification',
      'maxUploadSizeMb',
      'maintenanceMode',
      'enableTaskComments',
      'defaultUserRole'
    ];

    for (const [key, value] of Object.entries(req.body)) {
      if (allowedKeys.includes(key)) {
        await SystemSetting.findOneAndUpdate(
          { key },
          { key, value, updatedBy: req.user._id },
          { upsert: true, new: true }
        );
      }
    }

    await logActivity({
      actorId: req.user._id,
      action: 'SYSTEM_SETTINGS_UPDATED',
      entityType: 'Setting',
      details: 'Updated platform system configuration'
    });

    return successResponse(res, req.body, 'Settings updated successfully');
  } catch (err) {
    next(err);
  }
}
