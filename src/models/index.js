const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const config = require('../config');
const chalk = require('../utils/chalk');
const logger = require('../utils/logger');

const DBURI = config.db;

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
};

mongoose.connect(DBURI, options);
if (config.env === 'development') {
  mongoose.set('debug', true);
}

mongoose.connection.on('connected', () => {
  logger.info(chalk.blue('Connected to '), DBURI);
});

mongoose.connection.on('error', (err) => {
  logger.info(chalk.error('ERRROR CONNECTING'), {
    err,
  });
});

mongoose.connection.on('disconnected', () => {
  logger.info(chalk.error('Disconnected From '), DBURI);
});
