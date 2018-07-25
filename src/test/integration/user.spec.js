const chai = require('chai');
const chaiHttp = require('chai-http');
const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const { app } = require('../../app');
const { validUser } = require('../factory');
const { secret } = require('../../config');
const { expect } = require('chai');
const { removeUsers, createUser } = require('../seed');

const verifyPromise = promisify(verify);
const BASEURL = '/api/v1/user';

chai.use(chaiHttp);

describe('User', () => {
  afterEach(removeUsers);
  describe('POST /user/login', () => {
    it('should return a validation error message if username is not provided', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"username\" is required');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error message if password is not provided', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({ username: 'tobi'});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"password\" is required');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error message if username is less than 4 characters', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({
          username: 'a'
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"username\" length must be at least 4 characters long');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error message if username is more than 12 characters', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({
          username: 'arealllongusernamewheew'
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"username\" length must be less than or equal to 12 characters long');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error message if password is less than 6 characters', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({
          username: 'amostobi',
          password: 'pass'
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"password\" length must be at least 6 characters long');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error message if password is more than 32 characters', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({
          username: 'amostobi',
          password: 'passwordthatismorethanthirtytwocharactershowdoimakethisup'
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"password\" length must be less than or equal to 32 characters long');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a create a user and return a token', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send(validUser());
        expect(result.body.status).to.equal(200);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal(`Created Account for ${validUser().username}`);
        const decoded = await verifyPromise(result.body.data, secret);
        expect(decoded.username).to.equal(validUser().username);
      } catch (error) {
        throw error;
      }
    });
  });
  describe('POST /user/login 201', () => {
    before(createUser);
    it('should return a token for an existing user', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send(validUser());
        expect(result.body.status).to.equal(201);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal(`Welcome Back ${validUser().username}`);
        const decoded = await verifyPromise(result.body.data, secret);
        expect(decoded.username).to.equal(validUser().username);
      } catch (error) {
        throw error;
      }
    });

  });
});