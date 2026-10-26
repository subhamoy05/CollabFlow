import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES } from '../config/constants.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getCalendarEvents(req, res, next) {
  try {
    const { start, end, projectId } = req.query;

    let accessibleProjectIds = [];

    if (req.user.role === ROLES.ADMIN) {
      if (projectId) {
        accessibleProjectIds = [projectId];
      } else {
        const allProjects = await Project.find({ isArchived: false }).select('_id');
        accessibleProjectIds = allProjects.map(p => p._id);
      }
    } else {
      if (projectId) {
        // Verify user has access to this project
        const hasAccess = await ProjectMembership.findOne({ project: projectId, user: req.user._id });
        if (hasAccess) {
          accessibleProjectIds = [projectId];
        } else {
          const project = await Project.findById(projectId);
          if (project && !project.isPrivate) {
            const orgMember = await OrganizationMembership.findOne({
              organization: project.organization,
              user: req.user._id
            });
            if (orgMember) accessibleProjectIds = [projectId];
          }
        }
      } else {
        // Collect all projects user can view
        const memberships = await ProjectMembership.find({ user: req.user._id });
        const memberProjectIds = memberships.map(m => m.project);

        const myOrgs = await OrganizationMembership.find({ user: req.user._id });
        const orgIds = myOrgs.map(o => o.organization);

        const publicOrgProjects = await Project.find({
          organization: { $in: orgIds },
          isPrivate: false,
          isArchived: false
        }).select('_id');

        const allIds = new Set([
          ...memberProjectIds.map(id => id.toString()),
          ...publicOrgProjects.map(p => p._id.toString())
        ]);
        accessibleProjectIds = Array.from(allIds);
      }
    }

    const taskQuery = {
      project: { $in: accessibleProjectIds },
      dueDate: { $ne: null }
    };

    if (start && end) {
      taskQuery.dueDate = { $gte: new Date(start), $lte: new Date(end) };
    }

    const tasks = await Task.find(taskQuery)
      .populate('project', 'title key color')
      .populate('assignee', 'name email avatarUrl')
      .select('title key status priority dueDate startDate project assignee');

    const milestoneQuery = {
      project: { $in: accessibleProjectIds }
    };
    if (start && end) {
      milestoneQuery.dueDate = { $gte: new Date(start), $lte: new Date(end) };
    }

    const milestones = await ProjectMilestone.find(milestoneQuery)
      .populate('project', 'title key color')
      .select('title description dueDate isCompleted project');

    const events = [
      ...tasks.map(t => ({
        id: `task-${t._id}`,
        taskId: t._id,
        type: 'task',
        title: `${t.key}: ${t.title}`,
        start: t.dueDate,
        end: t.dueDate,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        project: t.project,
        assignee: t.assignee
      })),
      ...milestones.map(m => ({
        id: `milestone-${m._id}`,
        milestoneId: m._id,
        type: 'milestone',
        title: `Milestone: ${m.title}`,
        start: m.dueDate,
        end: m.dueDate,
        dueDate: m.dueDate,
        isCompleted: m.isCompleted,
        project: m.project
      }))
    ];

    return successResponse(res, events);
  } catch (err) {
    next(err);
  }
}
