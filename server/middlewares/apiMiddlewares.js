const express = require('express');
const fetch = require('node-fetch');

const api = express();

const cache = {};

const nhlApi = 'https://statsapi.web.nhl.com/api/v1';
api.get('*', async (req, res) => {
  try {
    const endpoint = req.originalUrl.replace('/api', '');
    if (cache[endpoint]) {
      return res.send(cache[endpoint]);
    }
    const response = await fetch(`${nhlApi}${endpoint}`);
    const json = await response.json();
    cache[endpoint] = json;
    return res.send(json);
  } catch (e) {
    console.error((e || e.stack).toString()); // eslint-disable-line
    return res.send(e.toString());
  }
});

module.exports = api;
