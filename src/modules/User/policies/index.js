const joi = require('joi');

module.exports.login = {
  body: {
    username: joi.string().alphanum().min(4).max(12)
      .required(),
    password: joi.string().alphanum().min(6).max(32)
      .required(),
  },
};
