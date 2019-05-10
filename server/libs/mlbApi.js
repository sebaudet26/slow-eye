const fetch = require('node-fetch');

const mlbApiBase = 'https://statsapi.mlb.com/api/v1/';
const mlbAjaxBase = 'http://mlb.mlb.com/pubajax/wf/flow/';

const mlbApi = async (resource) => {
  const url = `${mlbApiBase}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const mlbAjax = async (resource) => {
  const url = `${mlbAjaxBase}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Standings Page
const fetchDivisionStandings = () => mlbApi('standings?leagueId=103,104&season=2019&standingsTypes=regularSeason&hydrate=division,conference,sport,league)');

// Player Stats Page
const fetchBattingLeaders = () => mlbAjax('stats.splayer?season=2019&sort_order=%27desc%27&sort_column=%27avg%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&sport_code=%27mlb%27&totalSize=200');

module.exports = {
  fetchDivisionStandings,
  fetchBattingLeaders,
};
