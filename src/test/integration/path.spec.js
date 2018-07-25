const chai = require('chai');
const chaiHttp = require('chai-http');
const { verify, sign } = require('jsonwebtoken');
const { promisify } = require('util');
const { app } = require('../../app');
const { expect } = require('chai');
const { getAuthToken } = require('../seed');


const BASEURL = '/api/v1/patch';

chai.use(chaiHttp);

const { token } = getAuthToken();

describe('Patch', () => {
  describe('PATCH /patch', () => {
    it('should return a validation error if an authorization token is not passed in the headers', async () => {
      try {
       const result = await chai.request(app).patch(BASEURL).send({});
       expect(result.body.status).to.equal(403);
       expect(result.body.method).to.equal('PATCH');
       expect(result.body.message).to.equal('Authorization token is required');
       expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error if an authorization token is invalid', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', 'token').send({});
        expect(result.body.status).to.equal(403);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('Authorization token is invalid');
        expect(result.body.data).to.be.null;
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an empty payload is sent', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonbody\" is required');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an empty jsonbody is sent', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({ jsonbody: {}});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonbody\" must have at least 1 children');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an jsonpatch is not sent', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "baz": "qux",
            "foo": "bar"
          }
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonpatch\" is required');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an jsonpatch is empty', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "baz": "qux",
            "foo": "bar"
          },
          jsonpatch: []
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonpatch\" must contain at least 1 items');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an jsonpatch is not an array', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "baz": "qux",
            "foo": "bar"
          },
          jsonpatch: 'i am a string'
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonpatch\" must be an array');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an jsonbody is not an object', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: 'i am a string',
          jsonpatch: []
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('\"jsonbody\" must be an object');
        expect(result.body.data).to.equal(null);
       } catch (error) {
        throw error;
      }
    });
    it('should return a patched json object', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "baz": "qux",
            "foo": "bar"
          },
          jsonpatch: [
            {
            "op": "replace",
            "path": "/baz",
            "value": "boo"
          }]
        });
        expect(result.body.status).to.equal(200);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('Patch applied successfully!');
        expect(result.body.data).to.be.an('object')
        expect(result.body.data.baz).to.equal('boo');
        expect(result.body.data.foo).to.equal('bar');
      } catch (error) {
        throw error;
      }
    });
    it('should return an error for a wrong replace patch operation', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "bab": "qux",
            "foo": "bar"
          },
          jsonpatch: [
            {
            "op": "replace",
            "path": "/baz",
            "value": "boo"
          }]
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('Replace operation must point to an existing value!');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should return an error for a wrong remove patch operation', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "bab": "qux",
            "foo": "bar"
          },
          jsonpatch: [
            {
            "op": "remove",
            "path": "/baz",
          }]
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('Remove operation must point to an existing value!');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should return an error for a wrong copy patch operation', async () => {
      try {
        const result = await chai.request(app).patch(BASEURL).set('Authorization', token).send({
          jsonbody: {
            "bab": "qux",
            "foo": "bar"
          },
          jsonpatch: [
            {
            "op": "copy",
            "from": "/boo",
            "value": "bez"
          }]
        });
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('PATCH');
        expect(result.body.message).to.equal('Path missing!');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
  });
})