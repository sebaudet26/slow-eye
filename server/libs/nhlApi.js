const {
  contains, filter, flatten, map, mergeAll, path, prop, pipe, equals, toLower, propOr,
} = require('ramda');

const moment = require('moment');
const fetch = require('node-fetch');

const nhlApiUrl = 'https://statsapi.web.nhl.com/api/v1';

const cache = {};

const draftInfoCache = {};

const nhlAPI = async (resource, shouldNotCache) => {
  try {
    if (!shouldNotCache && cache[resource]) {
      return cache[resource];
    }
    const url = `${nhlApiUrl}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!shouldNotCache) {
      cache[resource] = data;
    }
    return data;
  } catch (e) {
    return console.error(e.stack || e.toString());
  }
};

/* draftData
  {
    "copyright" : "NHL and the NHL Shield are registered trademarks of
    the National Hockey League. NHL and NHL team marks are the property of
    the NHL and its teams. © NHL 2018. All Rights Reserved.",
    "drafts" : [ {
      "draftYear" : 2018,
      "rounds" : [ {
        "roundNumber" : 1,
        "round" : "1",
        "picks" : [ {
          "year" : 2018,
          "round" : "1",
          "pickOverall" : 1,
          "pickInRound" : 1,
          "team" : {
            "id" : 7,
            "name" : "Buffalo Sabres",
            "link" : "/api/v1/teams/7"
          },
          "prospect" : {
            "id" : 71988,
            "fullName" : "Rasmus Dahlin",
            "link" : "/api/v1/draft/prospects/71988"
          }
        }
      }],
    }],
  }
*/

// TODO: should use a regex to take out special characters
// or maybe fuzzy matching instead of strict match
const compareToName = playerName => pipe(path(['prospect', 'fullName']), toLower, equals(toLower(playerName)));

const findPlayerInDraft = (draftRounds, playerName) => {
  let playerDraftInfo = null;
  draftRounds.forEach((round) => {
    const playersFound = filter(compareToName(playerName), round.picks);
    if (playersFound.length) {
      [playerDraftInfo] = playersFound;
    }
  });
  return playerDraftInfo;
};

/*
{
  "copyright" : "NHL and the NHL Shield are registered trademarks
  of the National Hockey League. NHL and NHL team marks are the property of
  the NHL and its teams. © NHL 2018. All Rights Reserved.",
  "stats" : [ {
    "type" : {
      "displayName" : "gameLog"
    },
    "splits" : [ {
      "season" : "20182019",
      "stat" : {
        "timeOnIce" : "23:10",
        "assists" : 0,
        "goals" : 0,
        "pim" : 2,
        "shots" : 2,
        "games" : 1,
        "hits" : 0,
        "powerPlayGoals" : 0,
        "powerPlayPoints" : 0,
        "powerPlayTimeOnIce" : "07:06",
        "evenTimeOnIce" : "16:04",
        "penaltyMinutes" : "2",
        "shotPct" : 0.0,
        "gameWinningGoals" : 0,
        "overTimeGoals" : 0,
        "shortHandedGoals" : 0,
        "shortHandedPoints" : 0,
        "shortHandedTimeOnIce" : "00:00",
        "blocked" : 0,
        "plusMinus" : -2,
        "points" : 0,
        "shifts" : 26
      },
      "team" : {
        "id" : 21,
        "name" : "Colorado Avalanche",
        "link" : "/api/v1/teams/21"
      },
      "opponent" : {
        "id" : 2,
        "name" : "New York Islanders",
        "link" : "/api/v1/teams/2"
      },
      "date" : "2018-12-17",
      "isHome" : true,
      "isWin" : false,
      "isOT" : false,
      "game" : {
        "gamePk" : 2018020516,
        "link" : "/api/v1/game/2018020516/feed/live",
        "content" : {
          "link" : "/api/v1/game/2018020516/content"
        }
      }
    }
*/
const fetchCurrentSeasonGameLogsForPlayerId = async (playerId) => {
  const apiResponse = await nhlAPI(`/people/${playerId}/stats?stats=gameLog`);
  const gameLogs = path(['stats', 0, 'splits'], apiResponse);
  return gameLogs;
};

// https://github.com/dword4/nhlapi#draft
const fetchDraftInfoForPlayer = async (playerName, year = 2018) => {
  if (draftInfoCache[playerName]) {
    return draftInfoCache[playerName];
  }
  // Undrafted
  if (year < 1980) {
    return {};
  }
  // Get a batch of 5 years worth of draft picks
  const apiData = await nhlAPI(`/draft/${year}`);
  const draftRounds = path(['drafts', 0, 'rounds'], apiData);
  const draftInfoForPlayer = findPlayerInDraft(draftRounds, playerName);
  if (draftInfoForPlayer) {
    draftInfoCache[playerName] = draftInfoForPlayer;
    return draftInfoForPlayer;
  }
  return fetchDraftInfoForPlayer(playerName, year - 1);
};

const fetchInfoForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}`;
  const playerInfoData = await nhlAPI(resource);
  return path(['people', 0], playerInfoData);
};

const fetchStatsForPlayerId = async (playerId, args) => {
  let resource = `/people/${playerId}/stats?stats=statsSingleSeason`;
  if (args && args.season) {
    resource += `&season=${args.season}`;
  }
  const playerStatsData = await nhlAPI(resource);
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchAllYearsStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=yearByYear`;
  const playerStatsData = await nhlAPI(resource);
  // NHL = 133
  // AHL = 153
  const usefulLeagueIds = [133];
  const isStatUseful = seasonStat => contains(path(['league', 'id'], seasonStat), usefulLeagueIds);
  return filter(isStatUseful, path(['stats', 0, 'splits'], playerStatsData));
};

const fetchStatsForTeamId = async (teamId) => {
  let resource = `/teams/${teamId}/stats?stats=statsSingleSeason`;
  const teamInfo = await nhlAPI(resource, true);
  let stats = path(['stats', 0], teamInfo);
  if (!stats) {
    resource = `/teams/${teamId}?expand=team.stats`;
    await nhlAPI(resource, true);
    stats = path(['teams', 0, 'teamStats', 0], teamInfo);
  }
  return stats;
};

const fetchInfoForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}`;
  const teamInfo = await nhlAPI(resource);
  return path(['teams', 0], teamInfo);
};

const fetchPlayersForTeamId = async (teamId, args) => {
  let resource = `/teams/${teamId}/roster`;
  if (args && args.season) {
    resource += `?season=${args.season}`;
  }
  const json = await nhlAPI(resource);
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
  const allTeamsData = await nhlAPI(resource);
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
  const standingsResponse = await nhlAPI('/standings/wildCardWithLeaders?expand=standings.record');
  const standings = prop('records', standingsResponse);
  return standings;
};

const fetchGames = async (args) => {
  let resource = '/schedule';
  if (args.date) {
    resource += `?date=${args.date}`;
  } else {
    resource += `?date=${moment().subtract(12, 'hours').format('YYYY-MM-DD')}`;
  }
  console.log(resource);
  const gamesResponse = await nhlAPI(resource);
  const games = flatten(map(propOr({}, 'games'), gamesResponse.dates || []));
  return games;
};

module.exports = {
  nhlAPI,
  fetchStandings,
  fetchStatsForPlayerId,
  fetchCurrentSeasonGameLogsForPlayerId,
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
};
