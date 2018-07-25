const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./utils/logger');
const chalk = require('./utils/chalk');
const { sendJSONResponse } = require('./helpers');

require('./models');


const app = express();
