const express = require('express');
const expressValidator = require('express-joi-validator');
const userController = require('../controllers');
const userValidator = require('../policies');
const { catchErrors } = require('../../../helpers');

const router = express.Router();

router.post(
  '/login',
  expressValidator(userValidator.login),
  catchErrors(userController.login),
);


module.exports = router;
