import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import supertest from 'supertest';
import { app } from '../src/application/app';
import { TestUtils } from './utils';

describe('POST /v1/api/contacts', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
  });
  afterEach(async () => {
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should reject if request is invalid', async () => {
    const { status, body } = await supertest(app).post('/v1/api/contacts').set('X-API-TOKEN', 'test').send({
      firstName: true,
      lastName: '',
      email: '',
      phone: '081234567891',
    });
    expect(status).toBe(400);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should reject if token is invalid', async () => {
    const { status, body } = await supertest(app).post('/v1/api/contacts').set('X-API-TOKEN', 'wrongToken').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      phone: '081234567891',
    });
    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should can create new contact only with firstname', async () => {
    const { status, body } = await supertest(app).post('/v1/api/contacts').set('X-API-TOKEN', 'test').send({
      firstName: 'John',
    });

    expect(status).toBe(201);
    expect(body.status).toBe('success');
    expect(body.data.id).toBeDefined();
    expect(body.data.firstName).toBe('John');
  });

  it('should can create new contact only with firstname', async () => {
    const { status, body } = await supertest(app).post('/v1/api/contacts').set('X-API-TOKEN', 'test').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      phone: '081234567891',
    });

    expect(status).toBe(201);
    expect(body.status).toBe('success');
    expect(body.data.id).toBeDefined();
    expect(body.data.firstName).toBe('John');
    expect(body.data.lastName).toBe('Doe');
    expect(body.data.email).toBe('johndoe@email.com');
    expect(body.data.phone).toBe('081234567891');
  });
});

describe('GET /v1/api/contacts/:contactId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
  });
  afterEach(async () => {
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should can get a contact', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app).get(`/v1/api/contacts/${contact.id}`).set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.firstName).toBe('test');
    expect(body.data.lastName).toBe('test');
    expect(body.data.email).toBe('test@email.com');
    expect(body.data.phone).toBe('081234567891');
  });

  it('should reject request if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'wrongToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if contact id not found', async () => {
    const { status, body } = await supertest(app).get(`/v1/api/contacts/1`).set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});

describe('PUT /v1/api/contacts/:contactId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
  });
  afterEach(async () => {
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should reject request if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'wrongToken')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        phone: '081234567891',
      });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if contact id not found', async () => {
    const { status, body } = await supertest(app).put(`/v1/api/contacts/1`).set('X-API-TOKEN', 'test').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      phone: '081234567891',
    });

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 400 if request is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: 123,
        lastName: [],
        email: '',
        phone: '081234567891',
      });

    expect(status).toBe(400);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should can update contact', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        phone: '081234567891',
      });

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.id).toBeDefined();
    expect(body.data.firstName).toBe('John');
    expect(body.data.lastName).toBe('Doe');
    expect(body.data.email).toBe('johndoe@email.com');
    expect(body.data.phone).toBe('081234567891');
  });
});

describe('DELETE /v1/api/contacts/:contactId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
  });
  afterEach(async () => {
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should reject request if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .delete(`/v1/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'wrongToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if contact id not found', async () => {
    const { status, body } = await supertest(app).delete(`/v1/api/contacts/1`).set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should can delete contact', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app).delete(`/v1/api/contacts/${contact.id}`).set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.message).toBe('delete success');
  });
});

describe('GET /v1/api/contacts', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
  });
  afterEach(async () => {
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should reject request if token is invalid', async () => {
    const { status, body } = await supertest(app).get('/v1/api/contacts').set('X-API-TOKEN', 'wrongToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should be able to search contacts without query', async () => {
    const { status, body } = await supertest(app).get('/v1/api/contacts').set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(1);
    expect(body.paging.currentPage).toBe(1);
    expect(body.paging.totalPage).toBe(1);
    expect(body.paging.size).toBe(10);
  });

  it('should be able to search using name', async () => {
    const { status, body } = await supertest(app)
      .get('/v1/api/contacts')
      .query({
        name: 'es',
      })
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(1);
    expect(body.paging.currentPage).toBe(1);
    expect(body.paging.totalPage).toBe(1);
    expect(body.paging.size).toBe(10);
  });

  it('should be able to search using email', async () => {
    const { status, body } = await supertest(app)
      .get('/v1/api/contacts')
      .query({
        email: '.com',
      })
      .set('X-API-TOKEN', 'test');
    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(1);
    expect(body.paging.currentPage).toBe(1);
    expect(body.paging.totalPage).toBe(1);
    expect(body.paging.size).toBe(10);
  });

  it('should be able to search using phone', async () => {
    const { status, body } = await supertest(app)
      .get('/v1/api/contacts')
      .query({
        phone: '08',
      })
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(1);
    expect(body.paging.currentPage).toBe(1);
    expect(body.paging.totalPage).toBe(1);
    expect(body.paging.size).toBe(10);
  });

  it('should be able to search no result', async () => {
    const { status, body } = await supertest(app)
      .get('/v1/api/contacts')
      .query({
        name: 'wrongName',
      })
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(0);
    expect(body.paging.currentPage).toBe(1);
    expect(body.paging.totalPage).toBe(0);
    expect(body.paging.size).toBe(10);
  });

  it('should be able to search with paging', async () => {
    const { status, body } = await supertest(app)
      .get('/v1/api/contacts')
      .query({
        page: 2,
        size: 1,
      })
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.length).toBe(0);
    expect(body.paging.currentPage).toBe(2);
    expect(body.paging.totalPage).toBe(1);
    expect(body.paging.size).toBe(1);
  });
});
