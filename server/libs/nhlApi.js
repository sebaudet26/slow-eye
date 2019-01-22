const {
  contains, filter, flatten, map, mergeAll, path, prop, pipe, equals, toLower, propOr, takeLast,
} = require('ramda');
const moment = require('moment');
const fetch = require('node-fetch');
const cache = require('./redisApi');

const nhlApiUrl = 'https://statsapi.web.nhl.com/api/v1';

// expiration is a number in seconds
const nhlApi = async (resource, expiration, force) => {
  try {
    if (!force) {
      const cachedValue = await cache.get(resource);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }
    const url = `${nhlApiUrl}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    cache
      .set(resource, JSON.stringify(data), 'EX', expiration || 60 * 60 * 12);
    return data;
  } catch (e) {
    return console.error(e.stack || e.toString());
  }
};

// TODO: should use a regex to take out special characters
// or maybe fuzzy matching instead of strict match
const compareToName = playerName => pipe(path(['prospect', 'fullName']), toLower, equals(toLower(playerName)));

const findPlayerInDraft = (draftRounds, playerName) => {
  let playerDraftInfo = {};
  for (let i = 0; i < draftRounds.length; i++) {
    const round = draftRounds[i];
    const playersFound = filter(compareToName(playerName), round.picks);
    if (playersFound.length) {
      [playerDraftInfo] = playersFound;
      break;
    }
  }
  return playerDraftInfo;
};

const fetchGameLogsForPlayerId = async (playerId) => {
  const apiResponse = await nhlApi(`/people/${playerId}/stats?stats=gameLog`);
  const gameLogs = path(['stats', 0, 'splits'], apiResponse);
  return gameLogs;
};

const fetchPlayoffGameLogsForPlayerId = async (playerId) => {
  const apiResponse = await nhlApi(`/people/${playerId}/stats?stats=playoffGameLog`);
  const gameLogs = path(['stats', 0, 'splits'], apiResponse);
  return gameLogs;
};

// https://github.com/dword4/nhlapi#draft
const fetchDraftInfoForPlayer = async (playerName, year = 2018) => {
  const key = `draft-${playerName.replace(' ', '')}`;
  const cachedValue = await cache.get(key);
  if (cachedValue && cachedValue !== 'undefined') {
    return JSON.parse(cachedValue);
  }
  // Undrafted
  if (year < 1980) {
    return {};
  }
  // Get a batch of 5 years worth of draft picks
  const apiData = await nhlApi(`/draft/${year}`, 60 * 60 * 24 * 300);
  const draftRounds = path(['drafts', 0, 'rounds'], apiData);
  const draftInfoForPlayer = findPlayerInDraft(draftRounds, playerName);
  if (Object.keys(draftInfoForPlayer).length) {
    cache
      .set(key, JSON.stringify(draftInfoForPlayer), 'EX', 60 * 60 * 24 * 300);
    return draftInfoForPlayer;
  }
  return fetchDraftInfoForPlayer(playerName, year - 1);
};

const fetchInfoForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}`;
  const playerInfoData = await nhlApi(resource);
  return path(['people', 0], playerInfoData);
};

const fetchStatsForPlayerId = async (playerId, args) => {
  let resource = `/people/${playerId}/stats?stats=statsSingleSeason`;
  if (args && args.season) {
    resource += `&season=${args.season}`;
  }
  const playerStatsData = await nhlApi(resource);
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchPlayoffStatsForPlayerId = async (playerId, args) => {
  let resource = `/people/${playerId}/stats?stats=statsSingleSeasonPlayoffs`;
  if (args && args.season) {
    resource += `&season=${args.season}`;
  }
  const playerStatsData = await nhlApi(resource);
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchAllYearsStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=yearByYear`;
  const playerStatsData = await nhlApi(resource);
  // NHL = 133
  // AHL = 153
  const usefulLeagueIds = [133];
  const isStatUseful = seasonStat => contains(path(['league', 'id'], seasonStat), usefulLeagueIds);
  return filter(isStatUseful, path(['stats', 0, 'splits'], playerStatsData));
};

const fetchAllYearsPlayoffStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=yearByYearPlayoffs`;
  const playerStatsData = await nhlApi(resource);
  // NHL = 133
  // AHL = 153
  const usefulLeagueIds = [133];
  const isStatUseful = seasonStat => contains(path(['league', 'id'], seasonStat), usefulLeagueIds);
  return filter(isStatUseful, path(['stats', 0, 'splits'], playerStatsData));
};

const fetchStatsForTeamId = async (teamId) => {
  let resource = `/teams/${teamId}/stats?stats=statsSingleSeason`;
  const teamInfo = await nhlApi(resource, 60 * 60);
  let stats = path(['stats', 0], teamInfo);
  if (!stats) {
    resource = `/teams/${teamId}?expand=team.stats`;
    await nhlApi(resource, true);
    stats = path(['teams', 0, 'teamStats', 0], teamInfo);
  }
  return stats;
};

const fetchInfoForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}`;
  const teamInfo = await nhlApi(resource);
  return path(['teams', 0], teamInfo);
};

const fetchPlayersForTeamId = async (teamId, args) => {
  let resource = `/teams/${teamId}/roster`;
  if (args && args.season) {
    resource += `?season=${args.season}`;
  }
  const json = await nhlApi(resource);
  const allRosterIds = map(path(['person', 'id']), json.roster);
  const playerInfo = mergeAll(json.roster.map(p => ({ [p.person.id]: { ...p } })));
  const fullData = allRosterIds.map(id => ({
    teamId, id, ...playerInfo[id],
  }));
  return fullData;
};

const fetchAllTeams = async (args) => {
  let resource = '/teams';
  if (args && args.season) {
    resource += `?season=${args.season}`;
  }
  const allTeamsData = await nhlApi(resource, 60 * 60 * 24 * 300);
  return prop('teams', allTeamsData);
};

const fetchPlayer = async (playerId) => {
  const stats = await fetchAllYearsStatsForPlayerId(playerId);
  const info = await fetchInfoForPlayerId(playerId);
  return {
    stats,
    info,
  };
};

const fetchAllPlayers = async (args) => {
  const allTeamsData = await fetchAllTeams(args);
  const allTeamsIds = map(prop('id'), allTeamsData);
  const promises = map(id => fetchPlayersForTeamId(id, args), allTeamsIds);
  const allTeamsRosters = await Promise.all(promises);
  return flatten(allTeamsRosters);
};

const fetchStandings = async () => {
  const standingsResponse = await nhlApi('/standings/wildCardWithLeaders?expand=standings.record', 60 * 60);
  const standings = prop('records', standingsResponse);
  return standings;
};

const fetchGames = async (args) => {
  let resource = '/schedule';
  let cacheExp = 60 * 60;
  if (args.date) {
    resource += `?date=${args.date}`;
    if (moment(args.date).subtract(1, 'day').isBefore(moment())) {
      cacheExp = 60 * 60 * 24 * 300;
    }
  } else {
    resource += `?date=${moment().format('YYYY-MM-DD')}`;
  }
  const gamesResponse = await nhlApi(resource, cacheExp || 60, true);
  const games = flatten(map(propOr({}, 'games'), gamesResponse.dates || []));
  return games;
};

const fetchBoxscore = async (gameId) => {
  const resource = `/game/${gameId}/boxscore`;
  console.log(resource);
  const boxscoreResponse = await nhlApi(resource, 60);
  return {
    id: gameId,
    ...prop('teams', boxscoreResponse),
  };
};

const fetchLiveFeed = async (gameId) => {
  const resource = `/game/${gameId}/feed/live`;
  const liveFeedResponse = await nhlApi(resource, 60);
  console.log(resource);
  return {
    id: gameId,
    ...liveFeedResponse,
  };
};

module.exports = {
  nhlApi,
  fetchLiveFeed,
  fetchStandings,
  fetchStatsForPlayerId,
  fetchGameLogsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchDraftInfoForPlayer,
  fetchInfoForPlayerId,
  fetchPlayer,
  fetchInfoForTeamId,
  fetchStatsForTeamId,
  fetchPlayersForTeamId,
  fetchAllTeams,
  fetchAllPlayers,
  fetchGames,
  fetchBoxscore,
  fetchAllYearsPlayoffStatsForPlayerId,
  fetchPlayoffGameLogsForPlayerId,
};
