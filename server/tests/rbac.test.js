import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { ROLES } from '../src/config/constants.js';

describe('RBAC & Security Permission Tests', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('denies standard user access to /api/v1/admin/overview with 403', async () => {
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Regular Member',
        email: 'member@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token = regRes.body.data.accessToken;

    const adminRes = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(adminRes.status, 403);
    assert.equal(adminRes.body.error.code, 'ADMIN_ONLY');
  });

  it('grants global Admin access to /api/v1/admin/overview with 200', async () => {
    // Create admin user directly
    const passwordHash = await User.hashPassword('Password123!');
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@collabflow.dev',
      passwordHash,
      role: ROLES.ADMIN,
      status: 'active'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@collabflow.dev',
        password: 'Password123!'
      });

    const token = loginRes.body.data.accessToken;

    const adminRes = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(adminRes.status, 200);
    assert.equal(adminRes.body.success, true);
    assert.ok(adminRes.body.data.stats);
  });

  it('immediately blocks suspended user from protected routes with 403', async () => {
    const passwordHash = await User.hashPassword('Password123!');
    const suspendedUser = await User.create({
      name: 'Suspended Member',
      email: 'badactor@example.com',
      passwordHash,
      role: ROLES.TEAM_MEMBER,
      status: 'suspended'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'badactor@example.com',
        password: 'Password123!'
      });

    assert.equal(loginRes.status, 403);
    assert.equal(loginRes.body.error.code, 'ACCOUNT_SUSPENDED');
  });
});
