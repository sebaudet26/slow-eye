require('./util/loadDevEnv');
const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const logger = require('./util//logger');
const argv = require('./util/argv');
const port = require('./util//port');
const setup = require('./middlewares/frontendMiddleware');
const api = require('./middlewares/api');
const graphql = require('./middlewares/graphql');
const redisApi = require('./libs/redisApi');

const app = express();

app.use('/images', express.static('app/images'));

app.use(bodyParser.json());
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use('/api', api);
app.use('/graphql', graphql);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  return logger.appStarted(port, prettyHost);
});
