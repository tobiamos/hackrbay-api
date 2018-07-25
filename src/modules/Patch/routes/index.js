const express = require('express');
const expressValidator = require('express-joi-validator');
const jsonPatchController = require('../controllers');
const validatePatch = require('../policies');
const { catchErrors } = require('../../../helpers');
const { authenticate } = require('../../User/controllers');

const router = express.Router();
router.patch(
  '/',
  catchErrors(authenticate),
  expressValidator(validatePatch.patch),
  jsonPatchController.performPatch,
);

module.exports = router;
