import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Organization } from '../src/models/Organization.js';
import { OrganizationMembership } from '../src/models/OrganizationMembership.js';
import { Project } from '../src/models/Project.js';
import { ProjectMembership } from '../src/models/ProjectMembership.js';
import { Task } from '../src/models/Task.js';
import { TaskComment } from '../src/models/TaskComment.js';
import { ChatMessage } from '../src/models/ChatMessage.js';
import { Notification } from '../src/models/Notification.js';
import { Sprint } from '../src/models/Sprint.js';
import { ROLES, ORG_ROLES, PROJECT_STATUSES, TASK_STATUSES, TASK_PRIORITIES, SPRINT_STATUSES, NOTIFICATION_TYPES } from '../src/config/constants.js';
import { env } from '../src/config/env.js';
import { stopMemoryServer } from '../src/config/memoryServer.js';

async function seedData() {
  if (env.IS_PRODUCTION) {
    console.error('FATAL: Seeding is blocked in production mode.');
    process.exit(1);
  }

  try {
    await connectDB();
    console.log('[Seed] Connected to database. Preparing demo data...');

    const defaultPassword = 'Password123!';
    const passwordHash = await User.hashPassword(defaultPassword);

    // 1. Create or fetch users
    const usersData = [
      { name: 'Arthur Admin', email: 'admin@collabflow.dev', role: ROLES.ADMIN },
      { name: 'Alex Martinez', email: 'alex.pm@collabflow.dev', role: ROLES.PROJECT_MANAGER },
      { name: 'Sarah Chen', email: 'sarah.dev@collabflow.dev', role: ROLES.TEAM_MEMBER },
      { name: 'David Kim', email: 'david.dev@collabflow.dev', role: ROLES.TEAM_MEMBER },
      { name: 'Olivia Vance', email: 'olivia.view@collabflow.dev', role: ROLES.VIEWER }
    ];

    const users = {};
    for (const u of usersData) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          status: 'active'
        });
      }
      users[u.email] = user;
    }

    console.log('[Seed] Demo users initialized.');

    // 2. Create Organization
    let org = await Organization.findOne({ slug: 'acme-innovations' });
    if (!org) {
      org = await Organization.create({
        name: 'Acme Innovations',
        slug: 'acme-innovations',
        owner: users['alex.pm@collabflow.dev']._id,
        description: 'Global engineering and product team workspace'
      });
    }

    // Add members to org
    const orgMembers = [
      { user: users['alex.pm@collabflow.dev'], role: ORG_ROLES.OWNER },
      { user: users['admin@collabflow.dev'], role: ORG_ROLES.ADMIN },
      { user: users['sarah.dev@collabflow.dev'], role: ORG_ROLES.MEMBER },
      { user: users['david.dev@collabflow.dev'], role: ORG_ROLES.MEMBER },
      { user: users['olivia.view@collabflow.dev'], role: ORG_ROLES.MEMBER }
    ];

    for (const m of orgMembers) {
      await OrganizationMembership.findOneAndUpdate(
        { organization: org._id, user: m.user._id },
        { organization: org._id, user: m.user._id, role: m.role },
        { upsert: true }
      );
    }

    // 3. Create Projects
    let project1 = await Project.findOne({ organization: org._id, key: 'CF' });
    if (!project1) {
      project1 = await Project.create({
        title: 'CollabFlow Platform Core',
        key: 'CF',
        description: 'Next-generation real-time collaboration suite with Kanban boards and chat.',
        organization: org._id,
        manager: users['alex.pm@collabflow.dev']._id,
        status: PROJECT_STATUSES.ACTIVE,
        color: '#6366F1',
        icon: 'FolderKanban',
        tags: ['Frontend', 'Backend', 'SocketIO']
      });
    }

    let project2 = await Project.findOne({ organization: org._id, key: 'MOB' });
    if (!project2) {
      project2 = await Project.create({
        title: 'Mobile App Redesign',
        key: 'MOB',
        description: 'iOS and Android client experience upgrade.',
        organization: org._id,
        manager: users['alex.pm@collabflow.dev']._id,
        status: PROJECT_STATUSES.PLANNING,
        color: '#10B981',
        icon: 'Smartphone',
        tags: ['Mobile', 'UX']
      });
    }

    // Assign Project Members
    const proj1Members = [
      { user: users['alex.pm@collabflow.dev'], role: ROLES.PROJECT_MANAGER },
      { user: users['sarah.dev@collabflow.dev'], role: ROLES.TEAM_MEMBER },
      { user: users['david.dev@collabflow.dev'], role: ROLES.TEAM_MEMBER },
      { user: users['olivia.view@collabflow.dev'], role: ROLES.VIEWER }
    ];

    for (const m of proj1Members) {
      await ProjectMembership.findOneAndUpdate(
        { project: project1._id, user: m.user._id },
        { project: project1._id, user: m.user._id, role: m.role },
        { upsert: true }
      );
    }

    // 4. Create Sprints
    let sprint1 = await Sprint.findOne({ project: project1._id, name: 'Sprint 1 - Core Foundations' });
    if (!sprint1) {
      sprint1 = await Sprint.create({
        name: 'Sprint 1 - Core Foundations',
        goal: 'Implement real-time Kanban board and Socket.IO infrastructure',
        project: project1._id,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        status: SPRINT_STATUSES.ACTIVE
      });
    }

    // 5. Create Sample Tasks
    const tasksData = [
      {
        title: 'Implement Socket.IO room isolation for projects',
        key: 'CF-1',
        taskNumber: 1,
        description: 'Verify project membership before letting sockets join project-specific channels.',
        project: project1._id,
        status: TASK_STATUSES.DONE,
        priority: TASK_PRIORITIES.HIGH,
        assignee: users['sarah.dev@collabflow.dev']._id,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        labels: ['Backend', 'Security'],
        estimatedEffort: 6,
        order: 0,
        sprint: sprint1._id,
        checklist: [
          { text: 'Write socketAuthMiddleware', completed: true },
          { text: 'Add project membership check', completed: true },
          { text: 'Unit test unauthorized access', completed: true }
        ]
      },
      {
        title: 'Build drag-and-drop Kanban board interface',
        key: 'CF-2',
        taskNumber: 2,
        description: 'Support fluid drag and drop across Backlog, Todo, In Progress, In Review, and Done columns.',
        project: project1._id,
        status: TASK_STATUSES.IN_PROGRESS,
        priority: TASK_PRIORITIES.URGENT,
        assignee: users['david.dev@collabflow.dev']._id,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        labels: ['Frontend', 'UI'],
        estimatedEffort: 10,
        order: 0,
        sprint: sprint1._id,
        checklist: [
          { text: 'Set up board columns', completed: true },
          { text: 'Hook up optimistic update rollback', completed: false }
        ]
      },
      {
        title: 'Add CSV export formula injection sanitization',
        key: 'CF-3',
        taskNumber: 3,
        description: 'Prefix formulas starting with =, +, -, @ with an apostrophe to prevent CSV injection.',
        project: project1._id,
        status: TASK_STATUSES.DONE,
        priority: TASK_PRIORITIES.HIGH,
        assignee: users['sarah.dev@collabflow.dev']._id,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        labels: ['Security'],
        estimatedEffort: 3,
        order: 1,
        sprint: sprint1._id
      },
      {
        title: 'Implement real-time project chat with presence indicators',
        key: 'CF-4',
        taskNumber: 4,
        description: 'Provide live typing indicators, message threading, and online status.',
        project: project1._id,
        status: TASK_STATUSES.IN_REVIEW,
        priority: TASK_PRIORITIES.MEDIUM,
        assignee: users['david.dev@collabflow.dev']._id,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        labels: ['Frontend', 'Chat'],
        estimatedEffort: 8,
        order: 0,
        sprint: sprint1._id
      },
      {
        title: 'Design interactive calendar with month/week views',
        key: 'CF-5',
        taskNumber: 5,
        description: 'Aggregate task deadlines and milestones with priority color coding.',
        project: project1._id,
        status: TASK_STATUSES.TODO,
        priority: TASK_PRIORITIES.MEDIUM,
        assignee: users['sarah.dev@collabflow.dev']._id,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        labels: ['Calendar'],
        estimatedEffort: 5,
        order: 0,
        sprint: sprint1._id
      },
      {
        title: 'Define Sprint 2 analytics and burndown chart specs',
        key: 'CF-6',
        taskNumber: 6,
        description: 'Document completion rate and workload calculation formulas.',
        project: project1._id,
        status: TASK_STATUSES.BACKLOG,
        priority: TASK_PRIORITIES.LOW,
        assignee: null,
        creator: users['alex.pm@collabflow.dev']._id,
        dueDate: null,
        labels: ['Planning'],
        estimatedEffort: 4,
        order: 0
      }
    ];

    for (const t of tasksData) {
      await Task.findOneAndUpdate({ project: t.project, key: t.key }, t, { upsert: true, new: true });
    }

    // 6. Create Chat Messages
    const sampleMessages = [
      { sender: users['alex.pm@collabflow.dev']._id, content: 'Welcome everyone to the CollabFlow project! Sprint 1 is underway.' },
      { sender: users['sarah.dev@collabflow.dev']._id, content: 'Finished the socket auth and CSV sanitization tasks!' },
      { sender: users['david.dev@collabflow.dev']._id, content: 'Kanban drag-and-drop is feeling great. Testing real-time task movement now.' }
    ];

    for (const msg of sampleMessages) {
      await ChatMessage.create({
        project: project1._id,
        sender: msg.sender,
        content: msg.content
      });
    }

    // 7. Create Sample Notifications
    await Notification.create({
      recipient: users['sarah.dev@collabflow.dev']._id,
      sender: users['alex.pm@collabflow.dev']._id,
      type: NOTIFICATION_TYPES.TASK_ASSIGNED,
      title: 'Task Assigned',
      message: 'Alex Martinez assigned you to CF-1: Implement Socket.IO room isolation',
      project: project1._id,
      link: `/app/projects/${project1._id}/board`
    });

    console.log('[Seed] Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials for Development:');
    console.log('  Admin:           admin@collabflow.dev / Password123!');
    console.log('  Project Manager: alex.pm@collabflow.dev / Password123!');
    console.log('  Team Member:     sarah.dev@collabflow.dev / Password123!');
    console.log('  Viewer:          olivia.view@collabflow.dev / Password123!');
    console.log('----------------------------------------------------');

    await disconnectDB();
    await stopMemoryServer();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
