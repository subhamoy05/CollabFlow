import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { TASK_STATUSES, TASK_PRIORITIES, ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateCsv } from '../utils/csvExporter.js';

async function getAuthorizedProjectIds(user, targetProjectId = null) {
  if (user.role === ROLES.ADMIN) {
    if (targetProjectId) return [targetProjectId];
    const all = await Project.find({ isArchived: false }).select('_id');
    return all.map(p => p._id);
  }

  const memberships = await ProjectMembership.find({ user: user._id });
  const myIds = memberships.map(m => m.project.toString());

  const userOrgs = await OrganizationMembership.find({ user: user._id });
  const publicProjects = await Project.find({
    organization: { $in: userOrgs.map(o => o.organization) },
    isPrivate: false,
    isArchived: false
  }).select('_id');

  const combined = new Set([...myIds, ...publicProjects.map(p => p._id.toString())]);

  if (targetProjectId) {
    return combined.has(targetProjectId.toString()) ? [targetProjectId] : [];
  }

  return Array.from(combined);
}

export async function getOverviewReport(req, res, next) {
  try {
    const projectIds = await getAuthorizedProjectIds(req.user);

    const totalProjects = projectIds.length;
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: TASK_STATUSES.DONE });
    const inProgressTasks = await Task.countDocuments({ project: { $in: projectIds }, status: TASK_STATUSES.IN_PROGRESS });
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: TASK_STATUSES.DONE },
      dueDate: { $ne: null, $lt: new Date() }
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Status breakdown
    const statusCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byStatus = Object.values(TASK_STATUSES).map(status => {
      const match = statusCounts.find(s => s._id === status);
      return { status, count: match ? match.count : 0 };
    });

    // Priority breakdown
    const priorityCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const byPriority = Object.values(TASK_PRIORITIES).map(priority => {
      const match = priorityCounts.find(p => p._id === priority);
      return { priority, count: match ? match.count : 0 };
    });

    // Member workload breakdown
    const memberWorkload = await Task.aggregate([
      { $match: { project: { $in: projectIds }, assignee: { $ne: null } } },
      {
        $group: {
          _id: '$assignee',
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
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          avatarUrl: '$user.avatarUrl',
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: { $subtract: ['$totalTasks', '$completedTasks'] },
          overdueTasks: 1
        }
      }
    ]);

    return successResponse(res, {
      metrics: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate
      },
      byStatus,
      byPriority,
      memberWorkload
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectReport(req, res, next) {
  try {
    const { projectId } = req.params;
    const authorizedIds = await getAuthorizedProjectIds(req.user, projectId);
    if (authorizedIds.length === 0) {
      return errorResponse(res, 'Access denied to this project report', 403);
    }

    const project = await Project.findById(projectId);
    if (!project) return errorResponse(res, 'Project not found', 404);

    const totalTasks = await Task.countDocuments({ project: projectId });
    const completedTasks = await Task.countDocuments({ project: projectId, status: TASK_STATUSES.DONE });
    const overdueTasks = await Task.countDocuments({
      project: projectId,
      status: { $ne: TASK_STATUSES.DONE },
      dueDate: { $ne: null, $lt: new Date() }
    });
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const statusCounts = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byStatus = Object.values(TASK_STATUSES).map(status => {
      const match = statusCounts.find(s => s._id === status);
      return { status, count: match ? match.count : 0 };
    });

    const priorityCounts = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const byPriority = Object.values(TASK_PRIORITIES).map(priority => {
      const match = priorityCounts.find(p => p._id === priority);
      return { priority, count: match ? match.count : 0 };
    });

    return successResponse(res, {
      project: {
        id: project._id,
        title: project.title,
        key: project.key
      },
      metrics: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate
      },
      byStatus,
      byPriority
    });
  } catch (err) {
    next(err);
  }
}

export async function exportCsv(req, res, next) {
  try {
    const { projectId } = req.query;
    const authorizedIds = await getAuthorizedProjectIds(req.user, projectId);
    if (projectId && authorizedIds.length === 0) {
      return errorResponse(res, 'Access denied to this project export', 403);
    }

    const tasks = await Task.find({ project: { $in: authorizedIds } })
      .populate('project', 'title key')
      .populate('assignee', 'name email')
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    const headers = [
      { key: 'key', label: 'Task Key' },
      { key: 'title', label: 'Title' },
      { key: 'project', label: 'Project' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'assignee', label: 'Assignee' },
      { key: 'creator', label: 'Creator' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'estimatedEffort', label: 'Estimated Effort (hrs)' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'completedAt', label: 'Completed At' }
    ];

    const rows = tasks.map(t => ({
      key: t.key,
      title: t.title,
      project: t.project?.title || '',
      status: t.status,
      priority: t.priority,
      assignee: t.assignee?.name || 'Unassigned',
      creator: t.creator?.name || '',
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : '',
      estimatedEffort: t.estimatedEffort || 0,
      createdAt: t.createdAt ? t.createdAt.toISOString() : '',
      completedAt: t.completedAt ? t.completedAt.toISOString() : ''
    }));

    const csvContent = generateCsv(headers, rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="collabflow-tasks-${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}
