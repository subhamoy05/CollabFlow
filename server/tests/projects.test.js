import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Organization } from '../src/models/Organization.js';
import { OrganizationMembership } from '../src/models/OrganizationMembership.js';
import { Project } from '../src/models/Project.js';
import { ROLES, ORG_ROLES } from '../src/config/constants.js';

describe('Project & Organization Isolation Tests', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('allows organization member to create a new project', async () => {
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Project Owner',
        email: 'owner@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token = regRes.body.data.accessToken;
    const orgId = regRes.body.data.defaultOrganization._id;

    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Alpha Project',
        key: 'ALP',
        organization: orgId,
        description: 'First test project'
      });

    assert.equal(projRes.status, 201);
    assert.equal(projRes.body.success, true);
    assert.equal(projRes.body.data.key, 'ALP');
  });

  it('prevents non-members from creating projects in another organization', async () => {
    // User 1 creates Org A
    const u1Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const orgAId = u1Res.body.data.defaultOrganization._id;

    // User 2 registers (has Org B)
    const u2Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token2 = u2Res.body.data.accessToken;

    // User 2 tries to create project in Org A
    const hostileRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        title: 'Hostile Project',
        key: 'HST',
        organization: orgAId
      });

    assert.equal(hostileRes.status, 403);
    assert.equal(hostileRes.body.success, false);
  });

  it('enforces private project boundaries against unauthorized users', async () => {
    // User 1
    const u1Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Secret Owner',
        email: 'secret@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token1 = u1Res.body.data.accessToken;
    const orgId = u1Res.body.data.defaultOrganization._id;

    // Create private project
    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Confidential Project',
        key: 'CONF',
        organization: orgId,
        isPrivate: true
      });

    const projectId = projRes.body.data._id;

    // User 2 tries to access User 1's private project by ID
    const u2Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Snooper User',
        email: 'snooper@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token2 = u2Res.body.data.accessToken;

    const accessRes = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token2}`);

    assert.equal(accessRes.status, 403);
    assert.equal(accessRes.body.error.code, 'PROJECT_ACCESS_DENIED');
  });
});
