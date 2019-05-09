const fetch = require('node-fetch');

const mlbApiBase = 'https://statsapi.mlb.com/api/v1/';

const mlbApi = async (resource) => {
  const url = `${mlbApiBase}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const fetchStandings = () => mlbApi('standings?leagueId=103,104&season=2019&standingsTypes=regularSeason&hydrate=division,conference,sport,league)');

module.exports = {
  fetchStandings,
};
