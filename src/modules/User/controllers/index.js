const mongoose = require('mongoose');
const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const { sendJSONResponse } = require('../../../helpers');
const { secret } = require('../../../config');

const verifyPromise = promisify(verify);

const User = mongoose.model('User');


module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    const user = new User();
    user.username = username;
    user.hashPassword(password);
    await user.save();
    const token = user.generateJWT();
    return sendJSONResponse(res, 200, token, req.method, `Created Account for ${user.username}`);
  }
  const token = existingUser.generateJWT();
  return sendJSONResponse(res, 201, token, req.method, `Welcome Back ${existingUser.username}`);
};

module.exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendJSONResponse(res, 401, null, req.method, 'Authorization token is required');
  }
  const decoded = await verifyPromise(token, secret);
  req.decoded = decoded;
  return next();
};
