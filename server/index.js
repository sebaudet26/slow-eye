require('./util/loadDevEnv');
const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const logger = require('./util/logger');
const port = require('./util/port');
const setup = require('./middlewares/frontendMiddleware');
const graphql = require('./middlewares/graphql');
require('./libs/redisApi');
const features = require('./features');

require('./libs/automatedJobs');

const app = express();

app.use('/images', express.static('app/images'));

app.use(bodyParser.json());

app.use('/graphql', graphql);

app.get('/features', (req, res) => {
  console.log('is production env', process.env.NODE_ENV === 'production');
  console.log('is qa', process.env.QA);
  if (process.env.NODE_ENV === 'production' && !process.env.QA) {
    return res.json(features.production);
  }
  return res.json(features.development);
});

setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const host = process.env.HOST || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // For nginx
  if (process.env.NODE_ENV === 'production') {
    fs.openSync('/tmp/app-initialized', 'w');
  }

  return logger.appStarted(port, host);
});
