require('./util/loadDevEnv');
const fs = require('fs');
const logger = require('./util/logger');
const port = require('./util/port');

// Does not do anything for now
// require('./libs/automatedJobs');
const cache = require('./libs/redis')
const server = require('./server')

// get the intended host and port number, use localhost and port 3000 if not provided
const host = process.env.HOST || 'localhost';

// Start your app.
server.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  // For nginx
  if (process.env.NODE_ENV === 'production') {
    fs.openSync('/tmp/app-initialized', 'w')
  }

  logger.appStarted(port, host)
  cache.connect()
});
