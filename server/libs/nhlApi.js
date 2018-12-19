const {
  contains, filter, flatten, map, mergeAll, path, prop, pipe, equals, toLower,
} = require('ramda');

const fetch = require('node-fetch');

const nhlApiUrl = 'https://statsapi.web.nhl.com/api/v1';

const cache = {};

const draftInfoCache = {};

const nhlAPI = async (resource) => {
  try {
    if (cache[resource]) {
      return cache[resource];
    }
    const url = `${nhlApiUrl}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    cache[resource] = data;
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
  // console.log('apiData', JSON.stringify(apiData, null, 2));
  const draftRounds = path(['drafts', 0, 'rounds'], apiData);
  // console.log('draftRounds', draftRounds);
  const draftInfoForPlayer = findPlayerInDraft(draftRounds, playerName);
  // console.log(draftInfoForPlayer);
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

const fetchStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=statsSingleSeason`;
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

const fetchInfoForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}`;
  const teamInfo = await nhlAPI(resource);
  return path(['teams', 0], teamInfo);
};

const fetchPlayersForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}/roster`;
  const json = await nhlAPI(resource);
  const allRosterIds = map(path(['person', 'id']), json.roster);
  const playerInfo = mergeAll(json.roster.map(p => ({ [p.person.id]: { ...p } })));
  const fullData = allRosterIds.map(id => ({
    teamId, id, ...playerInfo[id],
  }));
  return fullData;
};

const fetchAllTeams = async () => {
  const resource = '/teams';
  const allTeamsData = await nhlAPI(resource);
  return allTeamsData;
};

const fetchPlayer = async (playerId) => {
  console.log('fetching player');
  const stats = await fetchAllYearsStatsForPlayerId(playerId);
  const info = await fetchInfoForPlayerId(playerId);
  return {
    stats,
    info,
  };
};

const fetchAllPlayers = async () => {
  const allTeamsData = await fetchAllTeams();
  const allTeamsIds = map(prop('id'), prop('teams', allTeamsData));
  const allTeamsRosters = await Promise.all(map(fetchPlayersForTeamId, allTeamsIds));
  return flatten(allTeamsRosters);
};

module.exports = {
  nhlAPI,
  fetchStatsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchDraftInfoForPlayer,
  fetchInfoForPlayerId,
  fetchPlayer,
  fetchInfoForTeamId,
  fetchPlayersForTeamId,
  fetchAllTeams,
  fetchAllPlayers,
};
