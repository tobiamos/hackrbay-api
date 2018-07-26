const joi = require('joi');

module.exports.validateImageUrl = {
  body: {
    imageUrl: joi.string().min(6).required(),
  },
};
