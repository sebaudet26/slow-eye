const express = require('express');
const graphql = require('express-graphql');
const schema = require('../graphql/schema/root');

const app = express();

app.get('/', graphql({
  schema,
  graphiql: true,
}));

app.post('*', graphql({
  schema,
  graphiql: false,
}));

module.exports = app;
