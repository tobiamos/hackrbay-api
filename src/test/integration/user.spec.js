const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../app');
const { validUser } = require('../factory');
const BASEURL = '/api/v1/user';


describe('User', () => {
  describe('POST /user/login', () => {
    it('should return a validation error message if username is not provided', async () => {
      try {
        const result = await chai.request(app).post(`${BASEURL}/login`).send({});
        console.log('this');
        console.log(JSON.stringify(result, undefined, 3));
      } catch (error) {
        console.log('that');
        console.error(JSON.stringify(error, undefined, 3));
      }
    });
  });
});