const read = require('read-yaml');

if (process.env.NODE_ENV !== 'production') {
  const envVars = read.sync('.env.yml');
  Object.keys(envVars).forEach((varName) => {
    process.env[varName] = envVars[varName];
  });
}
