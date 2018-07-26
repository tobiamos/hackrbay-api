const express = require('express');
const expressValidator = require('express-joi-validator');
const validator = require('../policies');
const imageController = require('../controllers');
const { authenticate } = require('../../User/controllers');
const { catchErrors } = require('../../../helpers');

const router = express.Router();

router.post(
  '/resize',
  catchErrors(authenticate),
  expressValidator(validator.validateImageUrl),
  imageController.validateUrl,
  imageController.checkUrlExtenstion,
  imageController.getUrlMimeType,
  imageController.validateUrlMimeType,
  catchErrors(imageController.downloadImage),
);

module.exports = router;
