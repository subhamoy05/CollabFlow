import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { TASK_STATUSES, TASK_PRIORITIES } from '../src/config/constants.js';

describe('Task Management & Board Flow Tests', () => {
  let token;
  let projectId;

  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Task Master',
        email: 'taskmaster@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    token = regRes.body.data.accessToken;
    const orgId = regRes.body.data.defaultOrganization._id;

    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task Suite Project',
        key: 'TSP',
        organization: orgId
      });

    projectId = projRes.body.data._id;
  });

  it('creates a task with automatic key sequencing (e.g. TSP-1)', async () => {
    const taskRes = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Initialize database indexing',
        project: projectId,
        priority: TASK_PRIORITIES.HIGH,
        status: TASK_STATUSES.TODO,
        description: 'Ensure compound indexes are created on Task schema.'
      });

    assert.equal(taskRes.status, 201);
    assert.equal(taskRes.body.success, true);
    assert.equal(taskRes.body.data.key, 'TSP-1');
    assert.equal(taskRes.body.data.taskNumber, 1);
  });

  it('moves task between Kanban columns and updates order', async () => {
    const taskRes = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Implement drag and drop',
        project: projectId,
        status: TASK_STATUSES.TODO
      });

    const taskId = taskRes.body.data._id;

    const moveRes = await request(app)
      .patch(`/api/v1/tasks/${taskId}/move`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: TASK_STATUSES.IN_PROGRESS,
        order: 2
      });

    assert.equal(moveRes.status, 200);
    assert.equal(moveRes.body.data.status, TASK_STATUSES.IN_PROGRESS);
    assert.equal(moveRes.body.data.order, 2);
  });

  it('adds comments to a task successfully', async () => {
    const taskRes = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Review PR #42',
        project: projectId
      });

    const taskId = taskRes.body.data._id;

    const commentRes = await request(app)
      .post(`/api/v1/tasks/${taskId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Looks good! Added minor nitpicks on variable names.'
      });

    assert.equal(commentRes.status, 201);
    assert.equal(commentRes.body.success, true);
    assert.equal(commentRes.body.data.content, 'Looks good! Added minor nitpicks on variable names.');
  });
});
