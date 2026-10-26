import { Sprint } from '../models/Sprint.js';
import { Task } from '../models/Task.js';
import { SPRINT_STATUSES, TASK_STATUSES, ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getSprints(req, res, next) {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return errorResponse(res, 'projectId query parameter is required', 400);
    }

    const sprints = await Sprint.find({ project: projectId }).sort({ startDate: -1 });

    // Calculate sprint task counts and completion
    const sprintIds = sprints.map(s => s._id);
    const tasks = await Task.find({ sprint: { $in: sprintIds } });

    const enriched = sprints.map(sprint => {
      const sprintTasks = tasks.filter(t => t.sprint && t.sprint.toString() === sprint._id.toString());
      const totalTasks = sprintTasks.length;
      const completedTasks = sprintTasks.filter(t => t.status === TASK_STATUSES.DONE).length;
      const totalEffort = sprintTasks.reduce((sum, t) => sum + (t.estimatedEffort || 0), 0);
      const completedEffort = sprintTasks
        .filter(t => t.status === TASK_STATUSES.DONE)
        .reduce((sum, t) => sum + (t.estimatedEffort || 0), 0);
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...sprint.toObject(),
        stats: {
          totalTasks,
          completedTasks,
          remainingTasks: totalTasks - completedTasks,
          totalEffort,
          completedEffort,
          progress
        }
      };
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}

export async function createSprint(req, res, next) {
  try {
    const { name, goal, project: projectId, startDate, endDate } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return errorResponse(res, 'Sprint end date must be after start date', 400);
    }

    const sprint = await Sprint.create({
      name,
      goal: goal || '',
      project: projectId,
      startDate,
      endDate,
      status: SPRINT_STATUSES.PLANNED
    });

    return successResponse(res, sprint, 'Sprint created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSprint(req, res, next) {
  try {
    const { sprintId } = req.params;
    const { name, goal, startDate, endDate, status } = req.body;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return errorResponse(res, 'Sprint not found', 404);
    }

    if (name) sprint.name = name;
    if (goal !== undefined) sprint.goal = goal;
    if (startDate) sprint.startDate = startDate;
    if (endDate) sprint.endDate = endDate;
    if (status) sprint.status = status;

    await sprint.save();
    return successResponse(res, sprint, 'Sprint updated');
  } catch (err) {
    next(err);
  }
}

export async function startSprint(req, res, next) {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return errorResponse(res, 'Sprint not found', 404);
    }

    // Check if another sprint is currently active in the same project
    const activeSprint = await Sprint.findOne({
      project: sprint.project,
      status: SPRINT_STATUSES.ACTIVE,
      _id: { $ne: sprint._id }
    });

    if (activeSprint) {
      return errorResponse(res, `Sprint "${activeSprint.name}" is already active in this project. Please complete it first.`, 400);
    }

    sprint.status = SPRINT_STATUSES.ACTIVE;
    await sprint.save();

    return successResponse(res, sprint, 'Sprint started');
  } catch (err) {
    next(err);
  }
}

export async function completeSprint(req, res, next) {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return errorResponse(res, 'Sprint not found', 404);
    }

    sprint.status = SPRINT_STATUSES.COMPLETED;
    sprint.completedAt = new Date();
    await sprint.save();

    return successResponse(res, sprint, 'Sprint marked as completed');
  } catch (err) {
    next(err);
  }
}
