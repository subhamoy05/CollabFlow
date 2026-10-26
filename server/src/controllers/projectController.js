import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES, PROJECT_STATUSES, TASK_STATUSES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/auditService.js';

export async function getProjects(req, res, next) {
  try {
    const { organizationId, status, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const query = {};

    // Enforce organization boundary
    if (organizationId) {
      query.organization = organizationId;
    } else if (req.user.role !== ROLES.ADMIN) {
      // Find user's organizations
      const userOrgs = await OrganizationMembership.find({ user: req.user._id });
      query.organization = { $in: userOrgs.map(o => o.organization) };
    }

    if (status && status !== 'all') {
      query.status = status;
    } else {
      // Default: exclude archived unless explicitly requested
      query.isArchived = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Unless Admin, filter private projects to only those where user is member or manager
    if (req.user.role !== ROLES.ADMIN) {
      const myMemberships = await ProjectMembership.find({ user: req.user._id });
      const myProjectIds = myMemberships.map(m => m.project);

      query.$or = [
        ...(query.$or ? query.$or : []),
        { isPrivate: false },
        { manager: req.user._id },
        { _id: { $in: myProjectIds } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('manager', 'name email avatarUrl')
      .populate('organization', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Calculate live task stats for each project
    const projectIds = projects.map(p => p._id);
    const taskStats = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', TASK_STATUSES.DONE] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', TASK_STATUSES.DONE] },
                    { $ne: ['$dueDate', null] },
                    { $lt: ['$dueDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const statsMap = {};
    for (const stat of taskStats) {
      statsMap[stat._id.toString()] = stat;
    }

    const enrichedProjects = projects.map(p => {
      const stats = statsMap[p._id.toString()] || { totalTasks: 0, completedTasks: 0, overdueTasks: 0 };
      const progress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
      return {
        ...p.toObject(),
        taskStats: {
          ...stats,
          progress
        }
      };
    });

    return successResponse(res, enrichedProjects, 'Projects retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const { title, key, description, organization, manager, status, startDate, dueDate, color, icon, isPrivate, tags } = req.body;

    // Check organization membership
    if (req.user.role !== ROLES.ADMIN) {
      const isOrgMember = await OrganizationMembership.findOne({ organization, user: req.user._id });
      if (!isOrgMember) {
        return errorResponse(res, 'You must be a member of the organization to create a project', 403);
      }
    }

    // Check key uniqueness within organization
    const existingKey = await Project.findOne({ organization, key: key.toUpperCase() });
    if (existingKey) {
      return errorResponse(res, `Project key '${key.toUpperCase()}' is already in use in this workspace`, 409);
    }

    const projectManager = manager || req.user._id;

    const project = await Project.create({
      title,
      key: key.toUpperCase(),
      description: description || '',
      organization,
      manager: projectManager,
      status: status || PROJECT_STATUSES.ACTIVE,
      startDate: startDate || null,
      dueDate: dueDate || null,
      color: color || '#6366F1',
      icon: icon || 'FolderKanban',
      isPrivate: !!isPrivate,
      tags: tags || []
    });

    // Automatically add creator/manager to ProjectMembership
    await ProjectMembership.create({
      project: project._id,
      user: projectManager,
      role: ROLES.PROJECT_MANAGER
    });

    if (req.user._id.toString() !== projectManager.toString()) {
      await ProjectMembership.create({
        project: project._id,
        user: req.user._id,
        role: ROLES.PROJECT_MANAGER
      });
    }

    await logActivity({
      actorId: req.user._id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project._id,
      projectId: project._id,
      organizationId: organization,
      details: `Created project ${title} (${project.key})`
    });

    const populated = await Project.findById(project._id)
      .populate('manager', 'name email avatarUrl')
      .populate('organization', 'name slug');

    return successResponse(res, populated, 'Project created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.project._id)
      .populate('manager', 'name email avatarUrl')
      .populate('organization', 'name slug');

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({ project: project._id, status: TASK_STATUSES.DONE });
    const overdueTasks = await Task.countDocuments({
      project: project._id,
      status: { $ne: TASK_STATUSES.DONE },
      dueDate: { $ne: null, $lt: new Date() }
    });

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return successResponse(res, {
      ...project.toObject(),
      userRole: req.projectRole,
      taskStats: {
        totalTasks,
        completedTasks,
        overdueTasks,
        progress
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    if (req.projectRole !== ROLES.PROJECT_MANAGER && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only Project Managers can update project settings', 403);
    }

    const { title, description, manager, status, startDate, dueDate, color, icon, isPrivate, tags } = req.body;
    const project = req.project;

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (manager) project.manager = manager;
    if (status) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (color) project.color = color;
    if (icon) project.icon = icon;
    if (isPrivate !== undefined) project.isPrivate = isPrivate;
    if (tags) project.tags = tags;

    await project.save();

    await logActivity({
      actorId: req.user._id,
      action: 'PROJECT_UPDATED',
      entityType: 'Project',
      entityId: project._id,
      projectId: project._id,
      organizationId: project.organization,
      details: `Updated project ${project.title}`
    });

    const populated = await Project.findById(project._id)
      .populate('manager', 'name email avatarUrl')
      .populate('organization', 'name slug');

    return successResponse(res, populated, 'Project updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function archiveProject(req, res, next) {
  try {
    if (req.projectRole !== ROLES.PROJECT_MANAGER && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only Project Managers can archive this project', 403);
    }

    const project = req.project;
    project.isArchived = true;
    project.status = PROJECT_STATUSES.ARCHIVED;
    await project.save();

    await logActivity({
      actorId: req.user._id,
      action: 'PROJECT_ARCHIVED',
      entityType: 'Project',
      entityId: project._id,
      projectId: project._id,
      organizationId: project.organization,
      details: `Archived project ${project.title}`
    });

    return successResponse(res, project, 'Project archived successfully');
  } catch (err) {
    next(err);
  }
}

export async function restoreProject(req, res, next) {
  try {
    if (req.projectRole !== ROLES.PROJECT_MANAGER && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only Project Managers can restore this project', 403);
    }

    const project = req.project;
    project.isArchived = false;
    project.status = PROJECT_STATUSES.ACTIVE;
    await project.save();

    await logActivity({
      actorId: req.user._id,
      action: 'PROJECT_RESTORED',
      entityType: 'Project',
      entityId: project._id,
      projectId: project._id,
      organizationId: project.organization,
      details: `Restored project ${project.title}`
    });

    return successResponse(res, project, 'Project restored successfully');
  } catch (err) {
    next(err);
  }
}

export async function getProjectMembers(req, res, next) {
  try {
    const memberships = await ProjectMembership.find({ project: req.project._id })
      .populate('user', 'name email avatarUrl role status lastLoginAt')
      .sort({ createdAt: 1 });

    const members = memberships
      .filter(m => m.user)
      .map(m => ({
        id: m._id,
        user: m.user,
        role: m.role,
        joinedAt: m.createdAt
      }));

    return successResponse(res, members);
  } catch (err) {
    next(err);
  }
}

export async function addProjectMember(req, res, next) {
  try {
    if (req.projectRole !== ROLES.PROJECT_MANAGER && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only Project Managers can add members', 403);
    }

    const { userId, role } = req.body;

    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify user is in the same organization
    const orgMembership = await OrganizationMembership.findOne({
      organization: req.project.organization,
      user: userId
    });
    if (!orgMembership) {
      return errorResponse(res, 'User must belong to the organization before joining this project', 400);
    }

    let membership = await ProjectMembership.findOne({
      project: req.project._id,
      user: userId
    });

    if (membership) {
      membership.role = role;
      await membership.save();
    } else {
      membership = await ProjectMembership.create({
        project: req.project._id,
        user: userId,
        role: role || ROLES.TEAM_MEMBER
      });
    }

    const populated = await ProjectMembership.findById(membership._id).populate('user', 'name email avatarUrl role');

    return successResponse(res, populated, 'Member added to project', 201);
  } catch (err) {
    next(err);
  }
}

export async function removeProjectMember(req, res, next) {
  try {
    if (req.projectRole !== ROLES.PROJECT_MANAGER && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 'Only Project Managers can remove members', 403);
    }

    const { memberUserId } = req.params;

    if (req.project.manager && req.project.manager.toString() === memberUserId) {
      return errorResponse(res, 'Cannot remove the primary project manager', 400);
    }

    await ProjectMembership.deleteOne({
      project: req.project._id,
      user: memberUserId
    });

    return successResponse(res, null, 'Member removed from project');
  } catch (err) {
    next(err);
  }
}

export async function getProjectActivity(req, res, next) {
  try {
    const activities = await ActivityLog.find({ project: req.project._id })
      .populate('actor', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    return successResponse(res, activities);
  } catch (err) {
    next(err);
  }
}
