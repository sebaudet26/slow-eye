const {
  head, contains, find, filter, flatten, last, map, mergeAll, path, prop, pipe, pathOr, propOr, propEq, pathEq, mergeLeft,
} = require('ramda');
const moment = require('moment');
const fetch = require('node-fetch');
const cache = require('./redisApi');

const nhlApiBase = 'http://www.nhl.com/stats/rest';
const nhlRecordsBase = 'https://records.nhl.com/site/api';
const nhlStatsApiBase = 'https://statsapi.web.nhl.com/api/v1';

// expiration is a number in seconds
const nhlStatsApi = async (resource, expiration, force) => {
  try {
    if (!force) {
      const cachedValue = await cache.get(resource);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }
    const url = `${nhlStatsApiBase}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    cache
      .set(resource, JSON.stringify(data), 'EX', expiration || 60 * 60 * 12);
    return data;
  } catch (e) {
    return console.error(e.stack || e.toString());
  }
};

// expiration is a number in seconds
const nhlRecordsApi = async (resource, expiration, force) => {
  try {
    if (!force) {
      const cachedValue = await cache.get(resource);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }
    const url = `${nhlRecordsBase}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    cache
      .set(resource, JSON.stringify(data), 'EX', expiration || 60 * 60 * 12);
    return data;
  } catch (e) {
    return console.error(e.stack || e.toString());
  }
};

// expiration is a number in seconds
const nhlApi = async (resource, expiration, force) => {
  try {
    if (!force) {
      const cachedValue = await cache.get(resource);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }
    const url = `${nhlApiBase}${resource}`;
    const response = await fetch(url);
    const data = await response.json();
    cache
      .set(resource, JSON.stringify(data), 'EX', expiration || 60 * 60 * 12);
    return data;
  } catch (e) {
    return console.error(e.stack || e.toString());
  }
};

const fetchGameLogsForPlayerId = async (playerId) => {
  const apiResponse = await nhlStatsApi(`/people/${playerId}/stats?stats=gameLog`);
  const gameLogs = path(['stats', 0, 'splits'], apiResponse);
  return gameLogs;
};

const fetchPlayoffGameLogsForPlayerId = async (playerId) => {
  const apiResponse = await nhlStatsApi(`/people/${playerId}/stats?stats=playoffGameLog`);
  const gameLogs = path(['stats', 0, 'splits'], apiResponse);
  return gameLogs;
};

const fetchDraftInfoForPlayer = async (playerId) => {
  const response = await fetch(
    `https://records.nhl.com/site/api/draft?cayenneExp=playerId=${playerId}`,
  );
  const json = await response.json();
  return json.data[0];
};

const fetchInfoForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}`;
  const playerInfoData = await nhlStatsApi(resource);
  return path(['people', 0], playerInfoData);
};

const fetchStatsForPlayerId = async (playerId, args) => {
  let resource = `/people/${playerId}/stats?stats=statsSingleSeason`;
  if (args && args.season) {
    resource += `&season=${args.season}`;
  }
  const playerStatsData = await nhlStatsApi(resource);
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchPlayoffStatsForPlayerId = async (playerId, args) => {
  let resource = `/people/${playerId}/stats?stats=statsSingleSeasonPlayoffs`;
  if (args && args.season) {
    resource += `&season=${args.season}`;
  }
  const playerStatsData = await nhlStatsApi(resource);
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchAllYearsStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=yearByYear`;
  const playerStatsData = await nhlStatsApi(resource);
  // NHL = 133
  // AHL = 153
  const usefulLeagueIds = [133];
  const isStatUseful = seasonStat => contains(path(['league', 'id'], seasonStat), usefulLeagueIds);
  const nhlSeasons = filter(isStatUseful, path(['stats', 0, 'splits'], playerStatsData));
  // if nhler, return nhl seasons only
  if (nhlSeasons.length) {
    return nhlSeasons;
  }
  // if not, return everything we have
  return path(['stats', 0, 'splits'], playerStatsData);
};

const fetchAllYearsPlayoffStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=yearByYearPlayoffs`;
  const playerStatsData = await nhlStatsApi(resource);
  // NHL = 133
  // AHL = 153
  const usefulLeagueIds = [133];
  const isStatUseful = seasonStat => contains(path(['league', 'id'], seasonStat), usefulLeagueIds);
  return filter(isStatUseful, path(['stats', 0, 'splits'], playerStatsData));
};

const fetchStatsForTeamId = async (teamId) => {
  let resource = `/teams/${teamId}/stats?stats=statsSingleSeason`;
  const teamInfo = await nhlStatsApi(resource, 60 * 60);
  let stats = path(['stats', 0], teamInfo);
  if (!stats) {
    resource = `/teams/${teamId}?expand=team.stats`;
    await nhlStatsApi(resource, 60 * 60);
    stats = path(['teams', 0, 'teamStats', 0], teamInfo);
  }
  return stats;
};

const fetchInfoForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}`;
  const teamInfo = await nhlStatsApi(resource);
  return path(['teams', 0], teamInfo);
};

const fetchPlayersForTeamId = async (teamId, args) => {
  let resource = `/teams/${teamId}/roster`;
  if (args && args.season) {
    resource += `?season=${args.season}`;
  }
  const json = await nhlStatsApi(resource);
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
  const allTeamsData = await nhlStatsApi(resource, 60 * 60 * 24 * 300);
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
  const standingsResponse = await nhlStatsApi('/standings/wildCardWithLeaders?expand=standings.record', 60 * 60);
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
  const gamesResponse = await nhlStatsApi(resource, cacheExp || 60, true);
  const games = flatten(map(propOr({}, 'games'), gamesResponse.dates || []));
  return games;
};

const fetchBoxscore = async (gameId) => {
  const resource = `/game/${gameId}/boxscore`;
  const boxscoreResponse = await nhlStatsApi(resource, 60);
  return {
    id: gameId,
    ...prop('teams', boxscoreResponse),
  };
};

const fetchLiveFeed = async (gameId) => {
  const resource = `/game/${gameId}/feed/live`;
  const liveFeedResponse = await nhlStatsApi(resource, 60);
  return {
    id: gameId,
    ...liveFeedResponse,
  };
};

const fetchTeamRanking = async (teamId) => {
  const standingsResponse = await nhlStatsApi('/standings', 60 * 60);
  const teamStanding = pipe(
    map(o => o.teamRecords.map(t => ({ conference: o.conference, division: o.division, ...t }))),
    flatten,
    filter(pathEq(['team', 'id'], teamId)),
    head,
  )(standingsResponse.records);

  return {
    conference: teamStanding.conferenceRank,
    conferenceName: teamStanding.conference.name,
    division: teamStanding.divisionRank,
    divisionName: teamStanding.division.name,
    league: teamStanding.leagueRank,
  };
};

const fetchAllHistoryPlayers = async () => {
  const resourceSkaters = '/skaters?isAggregate=true&reportType=basic&reportName=bios&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]&cayenneExp=seasonId%3E=19171918%20and%20seasonId%3C=20182019';
  const resourceGoalies = '/goalies?isAggregate=true&reportType=goalie_basic&reportName=goaliebios&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]&cayenneExp=seasonId%3E=19171918%20and%20seasonId%3C=20182019';
  const [skaters, goalies] = await Promise.all([
    nhlApi(resourceSkaters, 60 * 60 * 24 * 7),
    nhlApi(resourceGoalies, 60 * 60 * 24 * 7),
  ]);
  return [...goalies.data, ...skaters.data];
};

const fetchPlayersReport = async (season = 20182019) => {
  const skatersummaryRookie = `/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}&sort=[{%22property%22:%22playerId%22}]`;
  const realtimeRookie = `/skaters?isAggregate=false&reportType=basic&reportName=realtime&sort=[{%22property%22:%22playerId%22}]&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`;
  const goaliesRookie = `/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary&sort=[{%22property%22:%22playerId%22}]&cayenneExp=playerRookieSeasonInd=1%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`;
  const goaliesAll = `/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary&sort=[{%22property%22:%22playerId%22}]&cayenneExp=seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`;
  // playerRookieSeasonInd=0 does not work ...
  const skatersummaryAll = `/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}&sort=[{%22property%22:%22playerId%22}]`;
  const realtimeAll = `/skaters?isAggregate=false&reportType=basic&reportName=realtime&sort=[{%22property%22:%22playerId%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`;

  try {
    const [
      skatersummaryRookieJSON,
      skatersummaryAllJSON,
      realtimeRookieJSON,
      realtimeAllJSON,
      goaliesRookieJSON,
      goaliesAllJSON,
    ] = await Promise.all([
      nhlApi(skatersummaryRookie, 60 * 60 * 24, true),
      nhlApi(skatersummaryAll, 60 * 60 * 24, true),
      nhlApi(realtimeRookie, 60 * 60 * 24, true),
      nhlApi(realtimeAll, 60 * 60 * 24, true),
      nhlApi(goaliesRookie, 60 * 60 * 24, true),
      nhlApi(goaliesAll, 60 * 60 * 24, true),
    ]);
    return pipe(
      map(prop('data')),
      ([arr1, arr2, arr3, arr4, arr5, arr6]) => {
        const rookiePlayerIds = map(prop('playerId'), arr1);
        const goalieRookieIds = map(prop('playerId'), arr5);
        return [
          ...arr1.map((item, k) => mergeLeft(arr1[k], { ...arr3[k], rookie: true })),
          ...arr2.map((item, k) => ({ ...item, ...arr4[k], rookie: false }))
            .filter(item => !rookiePlayerIds.includes(item.playerId)),
          ...arr5.map((item, k) => ({ ...arr5[k], rookie: true })),
          ...arr6.map((item, k) => ({ ...item, rookie: false }))
            .filter(item => !goalieRookieIds.includes(item.playerId)),
        ];
      },
    )([
      skatersummaryRookieJSON,
      skatersummaryAllJSON,
      realtimeRookieJSON,
      realtimeAllJSON,
      goaliesRookieJSON,
      goaliesAllJSON,
    ]);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchDraft = async (args) => {
  const resource = `/draft?cayenneExp=draftYear=${args.year}`;
  const draftResponse = await nhlRecordsApi(resource, 60 * 60 * 24 * 300, true);
  return draftResponse.data;
};

const fetchGameHighlights = async (id) => {
  const resource = `/game/${id}/content`;
  const gameContentResponse = await nhlStatsApi(resource, 60 * 60);
  const goalHighlightsUrls = map(
    pipe(
      pathOr([], ['highlight', 'playbacks']),
      last,
      pathOr('', ['url']),
    ),
    filter(o => o.type === 'GOAL', gameContentResponse.media.milestones.items),
  );
  const gameRecapUrl = pipe(
    pathOr([], ['media', 'epg']),
    find(propEq('title', 'Recap')),
    propOr([], ['items']),
    last,
    propOr({}, ['playbacks']),
    last,
    pathOr('', ['url']),
  )(gameContentResponse);
  return {
    recap: gameRecapUrl,
    goals: goalHighlightsUrls,
  };
};

module.exports = {
  fetchLiveFeed,
  fetchStandings,
  fetchStatsForPlayerId,
  fetchGameLogsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchDraftInfoForPlayer,
  fetchDraft,
  fetchInfoForPlayerId,
  fetchAllHistoryPlayers,
  fetchPlayer,
  fetchInfoForTeamId,
  fetchStatsForTeamId,
  fetchPlayersForTeamId,
  fetchAllTeams,
  fetchAllPlayers,
  fetchGames,
  fetchBoxscore,
  fetchTeamRanking,
  fetchAllYearsPlayoffStatsForPlayerId,
  fetchPlayoffGameLogsForPlayerId,
  fetchPlayersReport,
  fetchGameHighlights,
};
