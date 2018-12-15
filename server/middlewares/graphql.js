const express = require('express');
const graphql = require('express-graphql');
const schema = require('../schema');

const app = express();

app.use('*', graphql({
  schema,
  graphiql: true,
}));

module.exports = app;
