const express = require('express');
const expressValidator = require('express-joi-validator');
const jsonPatchController = require('../controllers');
const validatePatch = require('../policies');

const router = express.Router();
router.patch(
  '/',
  expressValidator(validatePatch.patch),
  jsonPatchController.performPatch,
);

module.exports = router;
