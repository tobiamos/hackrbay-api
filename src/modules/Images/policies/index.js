const joi = require('joi');

module.exports.validateImageUrl = {
  body: {
    imageUrl: joi.string().required(),
  },
};
