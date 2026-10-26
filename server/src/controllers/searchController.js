import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { ProjectMembership } from '../models/ProjectMembership.js';
import { OrganizationMembership } from '../models/OrganizationMembership.js';
import { ROLES } from '../config/constants.js';
import { successResponse } from '../utils/apiResponse.js';

export async function globalSearch(req, res, next) {
  try {
    const { q = '' } = req.query;
    const queryStr = q.trim();

    if (!queryStr) {
      return successResponse(res, { projects: [], tasks: [], members: [] });
    }

    const regex = new RegExp(queryStr, 'i');

    let accessibleProjectIds = [];
    let accessibleOrgIds = [];

    if (req.user.role === ROLES.ADMIN) {
      const allProjects = await Project.find({ isArchived: false }).select('_id');
      accessibleProjectIds = allProjects.map(p => p._id);
    } else {
      const memberships = await ProjectMembership.find({ user: req.user._id });
      const memberProjectIds = memberships.map(m => m.project);

      const userOrgs = await OrganizationMembership.find({ user: req.user._id });
      accessibleOrgIds = userOrgs.map(o => o.organization);

      const publicProjects = await Project.find({
        organization: { $in: accessibleOrgIds },
        isPrivate: false,
        isArchived: false
      }).select('_id');

      const allIds = new Set([
        ...memberProjectIds.map(id => id.toString()),
        ...publicProjects.map(p => p._id.toString())
      ]);
      accessibleProjectIds = Array.from(allIds);
    }

    // Search Projects
    const projects = await Project.find({
      _id: { $in: accessibleProjectIds },
      $or: [{ title: regex }, { key: regex }, { description: regex }]
    })
      .select('title key color icon status')
      .limit(10);

    // Search Tasks
    const tasks = await Task.find({
      project: { $in: accessibleProjectIds },
      $or: [{ title: regex }, { key: regex }, { description: regex }]
    })
      .populate('project', 'title key color')
      .populate('assignee', 'name avatarUrl')
      .select('title key status priority project assignee dueDate')
      .limit(15);

    // Search Members (within accessible orgs or projects)
    let memberQuery = {
      status: 'active',
      $or: [{ name: regex }, { email: regex }]
    };

    if (req.user.role !== ROLES.ADMIN && accessibleOrgIds.length > 0) {
      const orgMembers = await OrganizationMembership.find({ organization: { $in: accessibleOrgIds } });
      const allowedUserIds = orgMembers.map(m => m.user);
      memberQuery._id = { $in: allowedUserIds };
    }

    const members = await User.find(memberQuery)
      .select('name email avatarUrl role')
      .limit(10);

    return successResponse(res, {
      projects,
      tasks,
      members
    });
  } catch (err) {
    next(err);
  }
}
