const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../app');
const { expect } = require('chai');
const { getAuthToken } = require('../seed');


const BASEURL = '/api/v1/image/resize';

chai.use(chaiHttp);

const { token } = getAuthToken();

describe('Image', () => {
  describe('POST /resize', () => {
    it('should return a validation error if an authorization token is not passed in the headers', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).send({});
        expect(result.body.status).to.equal(401);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('Authorization token is required');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error if an authorization token is invalid', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', 'token').send({});
        expect(result.body.status).to.equal(403);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('Authorization token is invalid');
        expect(result.body.data).to.be.null;
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an empty payload is sent', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', token).send({});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"imageUrl\" is required');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an image url is less than 6 characters', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', token).send({imageUrl: 'http'});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('\"imageUrl\" length must be at least 6 characters long');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when an image url is not a weburl', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', token).send({imageUrl: 'mongodb://url.png'});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('Url is not a valid web url');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should return a validation error when a url is not an image url', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', token).send({imageUrl: 'http://hackerbay.io'});
        expect(result.body.status).to.equal(400);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('Url does not point to a valid image resource');
        expect(result.body.data).to.equal(null);
      } catch (error) {
        throw error;
      }
    });
    it('should download an image and return a thumbnail url', async () => {
      try {
        const result = await chai.request(app).post(BASEURL).set('Authorization', token).send({
          imageUrl: 'https://www.gstatic.com/webp/gallery/1.sm.jpg'
        });
        expect(result.body.status).to.equal(200);
        expect(result.body.method).to.equal('POST');
        expect(result.body.message).to.equal('Image thumbnail generated');
        expect(result.body.data).to.be.an('object');
        expect(result.body.data.thumbNailUrl).to.be.a('string');
      } catch (error) {
        throw error;
      }
    });
  })
});
