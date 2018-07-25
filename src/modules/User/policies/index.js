const joi = require('joi');

module.exports.login = {
  body: {
    username: joi.string().min(4).max(12).required(),
    password: joi.string().alphanum().min(6).required(),
  },
};
