require('dotenv').config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const logger = require('./utils/logger');
const chalk = require('./utils/chalk');
const { sendJSONResponse } = require('./helpers');

const app = express();

require('./models');

if (config.env !== 'test') {
  app.use(morgan('dev', { stream: logger.stream }));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const apiRoutes = require('./router');
const docs = require('./docs/swagger');

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(docs));
app.use('/api/v1', apiRoutes);

app.use((req, res, next) => {
  const err = new Error('We apologize, there seems to be a problem with your request.');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => { //eslint-disable-line
  if (config.env !== 'test') {
    logger.error(`Internal Server Error ${err}`);
  }
  if (err.isBoom) {
    const { message } = err.data[0];
    return sendJSONResponse(res, err.output.statusCode, null, req.method, message);
  }
  if (err.status === 404) {
    return sendJSONResponse(
      res,
      err.status, null, req.method,
      'We aplogise, there seems to be a problem with your request',
    );
  }
  return sendJSONResponse(res, 500, null, req.method, 'Something Went Wrong!');
});

app.listen(config.port, () => logger.info(chalk.blue('APP RUNNING ON'), config.port));

module.exports = { app };
