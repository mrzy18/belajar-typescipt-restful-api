import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import supertest from 'supertest';
import { app } from '../src/application/app';
import { TestUtils } from './utils';
import { logger } from '../src/application/logging';

describe('POST /v1/api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
  });
  afterEach(async () => {
    await TestUtils.removeAllAddress();
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should be able to create new address', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .post(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan Merdeka',
        city: 'Jakarta',
        province: 'Jakarta',
        country: 'Indonesia',
        postalCode: '12345',
      });

    expect(status).toBe(201);
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe('Jalan Merdeka');
    expect(body.data.city).toBe('Jakarta');
    expect(body.data.province).toBe('Jakarta');
    expect(body.data.country).toBe('Indonesia');
    expect(body.data.postalCode).toBe('12345');
  });

  it('should be able to create new address with country and postalCode', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .post(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        country: 'Indonesia',
        postalCode: '12345',
      });

    expect(status).toBe(201);
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBeNull();
    expect(body.data.city).toBeNull();
    expect(body.data.province).toBeNull();
    expect(body.data.country).toBe('Indonesia');
    expect(body.data.postalCode).toBe('12345');
  });

  it('should throw error 401 if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .post(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'wrongToken')
      .send({
        street: 'Jalan Merdeka',
        city: 'Jakarta',
        province: 'Jakarta',
        country: 'Indonesia',
        postalCode: '12345',
      });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 400 if request is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .post(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        city: 'Jakarta',
        province: 'Jakarta',
        country: true,
        postalCode: 12345,
      });

    expect(status).toBe(400);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if contact id not found', async () => {
    const { status, body } = await supertest(app).post(`/v1/api/contacts/1/addresses`).set('X-API-TOKEN', 'test').send({
      street: 'Jalan Merdeka',
      city: 'Jakarta',
      province: 'Jakarta',
      country: 'Indonesia',
      postalCode: '12345',
    });

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});

describe('GET /v1/api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
    await TestUtils.createAddress();
  });
  afterEach(async () => {
    await TestUtils.removeAllAddress();
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should be able get address', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(JSON.stringify(body));
    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe('Jalan Merdeka');
    expect(body.data.city).toBe('Jakarta');
    expect(body.data.province).toBe('Jakarta');
    expect(body.data.country).toBe('Indonesia');
    expect(body.data.postalCode).toBe('12345');
  });

  it('should throw error 404 if contact not found', async () => {
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/1/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if address not found', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}/addresses/1`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 401 if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'invalidToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});

describe('PUT /v1/api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
    await TestUtils.createAddress();
  });
  afterEach(async () => {
    await TestUtils.removeAllAddress();
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should be able to update address', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postalCode: '54321',
      });

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe('test');
    expect(body.data.city).toBe('test');
    expect(body.data.province).toBe('test');
    expect(body.data.country).toBe('test');
    expect(body.data.postalCode).toBe('54321');
  });

  it('should throw error 404 if contact not found', async () => {
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/1/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postalCode: '54321',
      });

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if address not found', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}/addresses/1`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postalCode: '54321',
      });

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 401 if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'invalidToken')
      .send({
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postalCode: '54321',
      });

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 400 if request is invalid', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .put(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'test',
        city: 'test',
        province: 'test',
        country: [],
        postalCode: 54321,
      });

    expect(status).toBe(400);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});

describe('DELETE /v1/api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
    await TestUtils.createAddress();
  });
  afterEach(async () => {
    await TestUtils.removeAllAddress();
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should be able to delete address', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .delete(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data.message).toBe('delete success');
  });

  it('should throw error 404 if contact not found', async () => {
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .delete(`/v1/api/contacts/1/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if address not found', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .delete(`/v1/api/contacts/${contact.id}/addresses/1`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 401 if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const address = await TestUtils.getAddress();
    const { status, body } = await supertest(app)
      .delete(`/v1/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'invalidToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});

describe('GET /v1/api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await TestUtils.createUser();
    await TestUtils.createContact();
    await TestUtils.createAddress();
  });
  afterEach(async () => {
    await TestUtils.removeAllAddress();
    await TestUtils.removeAllContact();
    await TestUtils.removeAllUser();
  });

  it('should be able to list addresses', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test');

    expect(status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBeDefined();
    expect(body.data[0].street).toBeDefined();
    expect(body.data[0].city).toBeDefined();
    expect(body.data[0].province).toBeDefined();
    expect(body.data[0].country).toBeDefined();
    expect(body.data[0].postalCode).toBeDefined();
  });

  it('should throw error 401 if token is invalid', async () => {
    const contact = await TestUtils.getContact();
    const { status, body } = await supertest(app)
      .get(`/v1/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'invalidToken');

    expect(status).toBe(401);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });

  it('should throw error 404 if conatct not found', async () => {
    const { status, body } = await supertest(app).get(`/v1/api/contacts/1/addresses`).set('X-API-TOKEN', 'test');

    expect(status).toBe(404);
    expect(body.status).toBe('error');
    expect(body.data.errors).toBeDefined();
  });
});
