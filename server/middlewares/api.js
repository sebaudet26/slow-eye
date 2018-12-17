const express = require('express');
const { nhlAPI } = require('../libs/nhlApi');

const api = express();

api.get('*', async (req, res) => {
  try {
    const resource = req.originalUrl.replace('/api', '');
    const json = await nhlAPI(resource);
    return res.send(json);
  } catch (e) {
    console.error((e || e.stack).toString()); // eslint-disable-line
    return res.send(e.toString());
  }
});

module.exports = api;
