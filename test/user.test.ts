import { describe, it, expect, afterEach, beforeEach, } from 'bun:test';
import supertest from 'supertest';
import { app } from '../src/application/app';
import { TestUtils } from './utils';

describe('POST /api/users', () => {
  afterEach(async () => {
    await TestUtils.removeAllUser();
  });

  it('should reject user new register if request is invalid', async () => {
    const result = await supertest(app).post('/v1/api/users').send({
      username: 3,
      name: '',
      password: '',
    });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('error');
    expect(result.body.data.errors).toBeDefined();
  });

  it('should can register new user', async () => {
    const result = await supertest(app).post('/v1/api/users').send({
      username: 'test',
      name: 'test',
      password: 'test',
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.username).toBe('test');

    const user = await TestUtils.getUser();
    expect(user?.username).toBe('test');
    expect(user?.name).toBe('test');
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
  });

  afterEach(async () => {
    await TestUtils.removeAllUser();
  });

  it('should return error 401 if username is invalid', async () => {
    const { body, status } = await supertest(app).post('/v1/api/users/login').send({
      username: 'wrongUsername',
      password: 'test',
    });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should return error 401 if password is invalid', async () => {
    const { body, status } = await supertest(app).post('/v1/api/users/login').send({
      username: 'test',
      password: 'wrongPassword',
    });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should can login', async () => {
    const { body, status } = await supertest(app).post('/v1/api/users/login').send({
      username: 'test',
      password: 'test',
    });

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.token).toBeDefined();

    const user = await TestUtils.getUser();
    expect(user?.token).toBeDefined();
  });
});

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
  });

  afterEach(async () => {
    await TestUtils.removeAllUser();
  });

  it('should be able to get user', async () => {
    const { body, status } = await supertest(app).get('/v1/api/users/current').set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.username).toBe('test');
    expect(body.data.name).toBe('test');
  });

  it('should reject if token is invalid', async () => {
    const { body, status } = await supertest(app).get('/v1/api/users/current').set('X-API-TOKEN', 'wrongToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBe('Unauthorized');
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
  });

  afterEach(async () => {
    await TestUtils.removeAllUser();
  });

  it('should reject if token is invalid', async () => {
    const { body, status } = await supertest(app)
      .patch('/v1/api/users/current')
      .set('X-API-TOKEN', 'wrongToken')
      .send({
        user: 'John Doe',
        password: 'superSecret'
      });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBe('Unauthorized');
  });

  it('should reject if request is invalid', async () => {
    const { body, status } = await supertest(app)
      .patch('/v1/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        user: '',
        password: ''
      });

    expect(status).toBe(400);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should be able to update user name', async () => {
    const { body, status } = await supertest(app)
      .patch('/v1/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        name: 'John Doe',
      });

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.name).toBe('John Doe');
  });

  it('should be able to update user password', async () => {
    const { body, status } = await supertest(app)
      .patch('/v1/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        password: 'superSecret',
      });

    expect(status).toBe(200);
    expect(body.status).toBe('success');

    const user = await TestUtils.getUser();
    expect(await Bun.password.verify('superSecret', user.password)).toBe(true);
  });
});

describe('DELETE /api/users/current', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
  });

  afterEach(async () => {
    await TestUtils.removeAllUser();
  });

  it('should reject if token is invalid', async () => {
    const { body, status } = await supertest(app)
      .delete('/v1/api/users/current')
      .set('X-API-TOKEN', 'wrongToken')

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBe('Unauthorized');
  });

  it('should be able to logout', async () => {
    const { body, status } = await supertest(app)
      .delete('/v1/api/users/current')
      .set('X-API-TOKEN', 'test')

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.message).toBe('delete success');

    const user = await TestUtils.getUser();
    expect(user.token).toBeNull();
  });
});