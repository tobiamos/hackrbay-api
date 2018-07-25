const joi = require('joi');

module.exports.patch = {
  body: {
    jsonbody: joi.object().min(1).required(),
    jsonpatch: joi.array().min(1).required(),
  },
};
