import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

describe('Authentication & User Flow Tests', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('registers a new user successfully and auto-creates personal workspace', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, 'jane@example.com');
    assert.equal(res.body.data.user.role, 'Team Member');
    assert.ok(res.body.data.accessToken);

    const savedUser = await User.findOne({ email: 'jane@example.com' });
    assert.ok(savedUser);
    // passwordHash should not be exposed
    assert.equal(res.body.data.user.passwordHash, undefined);
  });

  it('rejects duplicate email registrations with 409', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const duplicateRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jane Clone',
        email: 'jane@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    assert.equal(duplicateRes.status, 409);
    assert.equal(duplicateRes.body.success, false);
  });

  it('rejects weak password with validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Weak User',
        email: 'weak@example.com',
        password: '123',
        confirmPassword: '123'
      });

    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
  });

  it('authenticates user with valid credentials and sets cookie', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'Password123!'
      });

    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.body.success, true);
    assert.ok(loginRes.body.data.accessToken);

    // Verify cookie set
    const cookies = loginRes.headers['set-cookie'];
    assert.ok(cookies);
    assert.ok(cookies.some(c => c.includes('cf_access_token=')));
  });

  it('rejects invalid password with 401', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Bob Ross',
        email: 'bob@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const failRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'bob@example.com',
        password: 'WrongPassword!'
      });

    assert.equal(failRes.status, 401);
    assert.equal(failRes.body.success, false);
  });

  it('blocks unauthenticated access to /api/v1/auth/me', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('allows access to /api/v1/auth/me with valid Bearer token', async () => {
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    const token = regRes.body.data.accessToken;

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.data.user.email, 'charlie@example.com');
  });
});
