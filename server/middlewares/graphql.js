const express = require('express');
const graphql = require('express-graphql');
const schema = require('../graphql/schema');

const app = express();

app.get('/', graphql({
  schema,
  graphiql: true,
}));

app.get('/features', (req, res) => {
  if (process.env.NODE_ENV === 'production' && !process.env.QA) {
    return res.json(features.production);
  }
  return res.json(features.development);
});

app.post('*', graphql({
  schema,
  graphiql: false,
}));

module.exports = app;
