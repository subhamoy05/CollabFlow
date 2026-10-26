import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { TaskComment } from '../models/TaskComment.js';
import { FileAttachment } from '../models/FileAttachment.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ROLES, TASK_STATUSES, NOTIFICATION_TYPES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createAndSendNotification } from '../services/notificationService.js';
import { logActivity } from '../services/auditService.js';

let ioInstance = null;
export function setTaskIoInstance(io) {
  ioInstance = io;
}

export async function getTasks(req, res, next) {
  try {
    const {
      projectId,
      assignee,
      status,
      priority,
      sprint,
      search,
      sort = 'order',
      page = 1,
      limit = 100
    } = req.query;

    const query = {};

    if (projectId) {
      query.project = projectId;
    }

    if (assignee) {
      if (assignee === 'me') {
        query.assignee = req.user._id;
      } else if (assignee === 'unassigned') {
        query.assignee = null;
      } else {
        query.assignee = assignee;
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (sprint) {
      query.sprint = sprint === 'none' ? null : sprint;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatarUrl role')
      .populate('creator', 'name email avatarUrl')
      .populate('project', 'title key color')
      .populate('sprint', 'name status')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, tasks, 'Tasks retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const {
      title,
      description,
      project: projectId,
      status = TASK_STATUSES.TODO,
      priority,
      assignee,
      startDate,
      dueDate,
      labels,
      estimatedEffort,
      sprint
    } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Determine the next task number atomically or via highest taskNumber in project
    const lastTask = await Task.findOne({ project: projectId }).sort({ taskNumber: -1 });
    const taskNumber = (lastTask?.taskNumber || 0) + 1;
    const taskKey = `${project.key}-${taskNumber}`;

    // Get highest order in this status column
    const highestOrderTask = await Task.findOne({ project: projectId, status }).sort({ order: -1 });
    const order = (highestOrderTask?.order ?? -1) + 1;

    const task = await Task.create({
      title,
      key: taskKey,
      taskNumber,
      description: description || '',
      project: projectId,
      status,
      priority,
      assignee: assignee || null,
      creator: req.user._id,
      startDate: startDate || null,
      dueDate: dueDate || null,
      labels: labels || [],
      estimatedEffort: estimatedEffort || 0,
      sprint: sprint || null,
      order
    });

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarUrl role')
      .populate('creator', 'name email avatarUrl')
      .populate('project', 'title key color')
      .populate('sprint', 'name status');

    // Notify assignee if assigned to someone else
    if (assignee && assignee.toString() !== req.user._id.toString()) {
      await createAndSendNotification({
        recipientId: assignee,
        senderId: req.user._id,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: 'New Task Assigned',
        message: `${req.user.name} assigned you to ${taskKey}: ${title}`,
        projectId: project._id,
        taskId: task._id,
        link: `/app/projects/${project._id}/board?task=${task._id}`
      });
    }

    await logActivity({
      actorId: req.user._id,
      action: 'TASK_CREATED',
      entityType: 'Task',
      entityId: task._id,
      projectId: project._id,
      organizationId: project.organization,
      details: `Created task ${taskKey}: ${title}`
    });

    // Real-time broadcast to project room
    if (ioInstance) {
      ioInstance.to(`project:${projectId}`).emit('task:created', populated);
    }

    return successResponse(res, populated, 'Task created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignee', 'name email avatarUrl role')
      .populate('creator', 'name email avatarUrl')
      .populate('project', 'title key color organization')
      .populate('sprint', 'name status');

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const comments = await TaskComment.find({ task: task._id })
      .populate('author', 'name email avatarUrl role')
      .sort({ createdAt: 1 });

    const attachments = await FileAttachment.find({ task: task._id })
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      ...task.toObject(),
      comments,
      attachments
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const originalAssignee = task.assignee?.toString();
    const originalStatus = task.status;

    const allowedFields = [
      'title',
      'description',
      'status',
      'priority',
      'assignee',
      'startDate',
      'dueDate',
      'labels',
      'estimatedEffort',
      'sprint',
      'order'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarUrl role')
      .populate('creator', 'name email avatarUrl')
      .populate('project', 'title key color')
      .populate('sprint', 'name status');

    // Notify new assignee if reassigned
    if (task.assignee && task.assignee.toString() !== originalAssignee && task.assignee.toString() !== req.user._id.toString()) {
      await createAndSendNotification({
        recipientId: task.assignee,
        senderId: req.user._id,
        type: NOTIFICATION_TYPES.TASK_REASSIGNED,
        title: 'Task Reassigned',
        message: `${req.user.name} reassigned ${task.key}: ${task.title} to you`,
        projectId: task.project,
        taskId: task._id,
        link: `/app/projects/${task.project}/board?task=${task._id}`
      });
    }

    // Notify task creator or assignee on status change to DONE
    if (originalStatus !== task.status && task.status === TASK_STATUSES.DONE) {
      if (task.creator.toString() !== req.user._id.toString()) {
        await createAndSendNotification({
          recipientId: task.creator,
          senderId: req.user._id,
          type: NOTIFICATION_TYPES.TASK_STATUS_CHANGED,
          title: 'Task Completed',
          message: `${req.user.name} marked ${task.key}: ${task.title} as Done`,
          projectId: task.project,
          taskId: task._id,
          link: `/app/projects/${task.project}/board?task=${task._id}`
        });
      }
    }

    // Real-time broadcast to project room
    if (ioInstance) {
      ioInstance.to(`project:${task.project}`).emit('task:updated', populated);
    }

    return successResponse(res, populated, 'Task updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req, res, next) {
  try {
    const { status, order } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    task.status = status;
    task.order = order;
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarUrl role')
      .populate('creator', 'name email avatarUrl')
      .populate('project', 'title key color')
      .populate('sprint', 'name status');

    if (ioInstance) {
      ioInstance.to(`project:${task.project}`).emit('task:moved', {
        taskId: task._id,
        status,
        order,
        task: populated
      });
    }

    return successResponse(res, populated, 'Task moved successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const projectId = task.project;
    const taskKey = task.key;

    // Delete sub-resources
    await TaskComment.deleteMany({ task: task._id });
    await Task.deleteOne({ _id: task._id });

    await logActivity({
      actorId: req.user._id,
      action: 'TASK_DELETED',
      entityType: 'Task',
      entityId: task._id,
      projectId,
      details: `Deleted task ${taskKey}`
    });

    if (ioInstance) {
      ioInstance.to(`project:${projectId}`).emit('task:deleted', { taskId: task._id, projectId });
    }

    return successResponse(res, { taskId: task._id }, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function getTaskComments(req, res, next) {
  try {
    const comments = await TaskComment.find({ task: req.params.taskId })
      .populate('author', 'name email avatarUrl role')
      .sort({ createdAt: 1 });

    return successResponse(res, comments);
  } catch (err) {
    next(err);
  }
}

export async function addTaskComment(req, res, next) {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.taskId).populate('project');
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const comment = await TaskComment.create({
      task: task._id,
      project: task.project._id,
      author: req.user._id,
      content
    });

    const populated = await TaskComment.findById(comment._id).populate('author', 'name email avatarUrl role');

    // Notify assignee and creator if they are not the comment author
    const recipients = new Set();
    if (task.assignee) recipients.add(task.assignee.toString());
    if (task.creator) recipients.add(task.creator.toString());
    recipients.delete(req.user._id.toString());

    for (const recipientId of recipients) {
      await createAndSendNotification({
        recipientId,
        senderId: req.user._id,
        type: NOTIFICATION_TYPES.TASK_COMMENT,
        title: 'New Comment on Task',
        message: `${req.user.name} commented on ${task.key}: "${content.substring(0, 80)}"`,
        projectId: task.project._id,
        taskId: task._id,
        link: `/app/projects/${task.project._id}/board?task=${task._id}`
      });
    }

    // Broadcast comment update
    if (ioInstance) {
      ioInstance.to(`project:${task.project._id}`).emit('task:comment:created', {
        taskId: task._id,
        comment: populated
      });
    }

    return successResponse(res, populated, 'Comment added', 201);
  } catch (err) {
    next(err);
  }
}

export async function toggleChecklistItem(req, res, next) {
  try {
    const { taskId, itemId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return errorResponse(res, 'Task not found', 404);

    const item = task.checklist.id(itemId);
    if (!item) return errorResponse(res, 'Checklist item not found', 404);

    item.completed = !item.completed;
    await task.save();

    if (ioInstance) {
      ioInstance.to(`project:${task.project}`).emit('task:updated', task);
    }

    return successResponse(res, task.checklist, 'Checklist updated');
  } catch (err) {
    next(err);
  }
}

export async function addChecklistItem(req, res, next) {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return errorResponse(res, 'Task not found', 404);

    task.checklist.push({ text, completed: false });
    await task.save();

    if (ioInstance) {
      ioInstance.to(`project:${task.project}`).emit('task:updated', task);
    }

    return successResponse(res, task.checklist, 'Checklist item added', 201);
  } catch (err) {
    next(err);
  }
}

export async function removeChecklistItem(req, res, next) {
  try {
    const { taskId, itemId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return errorResponse(res, 'Task not found', 404);

    task.checklist.pull({ _id: itemId });
    await task.save();

    if (ioInstance) {
      ioInstance.to(`project:${task.project}`).emit('task:updated', task);
    }

    return successResponse(res, task.checklist, 'Checklist item removed');
  } catch (err) {
    next(err);
  }
}
