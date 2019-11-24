const express = require('express');
const bodyParser = require('body-parser');
const graphql = require('./middlewares/graphql');
const { resolve } = require('path');

const setup = require('./middlewares/frontendMiddleware');

const app = express()

app.use('/public/images', express.static('app/public/images'))

app.use(bodyParser.json())

app.use('/graphql', graphql)

setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
})

module.exports = app