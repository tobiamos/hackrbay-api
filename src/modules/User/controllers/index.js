const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

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
