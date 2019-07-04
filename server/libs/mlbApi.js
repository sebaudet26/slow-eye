const fetch = require('node-fetch');

const mlbApiBase = 'https://statsapi.mlb.com/api/v1/';
const mlbLookupBase = 'https://lookup-service-prod.mlb.com/';

const mlbApi = async (resource) => {
  const url = `${mlbApiBase}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const mlbLookup = async (resource) => {
  const url = `${mlbLookupBase}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Teams
const fetchTeams = () => mlbLookup('json/named.team_all_season.bam?sport_code=%27mlb%27&all_star_sw=%27N%27&season=%272019%27&sort_order=name_asc');

// Standings Page
const fetchDivisionStandings = () => mlbApi('standings?leagueId=103,104&season=2019&standingsTypes=regularSeason&hydrate=division,conference,sport,league)');

// Player Stats Page
const fetchBattingLeaders = () => mlbLookup('json/named.leader_hitting_repeater.bam?season=2019&sort_order=%27desc%27&sort_column=%27avg%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&sport_code=%27mlb%27&totalSize=200');
const fetchPitchingLeaders = () => mlbLookup('json/named.leader_pitching_repeater.bam?season=2019&sort_order=%27asc%27&sort_column=%27era%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&sport_code=%27mlb%27&totalSize=200');

// Player Page
const fetchPlayer = resource => mlbApi(`people/${resource}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`);
const fetchHittingCareer = resource => mlbLookup(`json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type=%27R%27&player_id=${resource}`);

module.exports = {
  fetchTeams,
  fetchDivisionStandings,
  fetchBattingLeaders,
  fetchPitchingLeaders,
  fetchPlayer,
  fetchHittingCareer,
};
