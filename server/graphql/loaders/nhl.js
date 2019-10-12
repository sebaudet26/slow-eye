/*

year
=> league 
	=> draft/season/playoffs/standings/schedule
	=> game
		=> boxscore/liveFeed
			=> teams/team/record 
			=> venue/players/player 
				=> bio/seasionStats/playoffStats/seasonGameLogs/playoffGameLogs/draft
				=> country/position/stat

now
=> teamStreaks/playerStreaks






*/


const {
  contains,
  descend,
  filter,
  find,
  flatten,
  head,
  last,
  map,
  mergeAll,
  mergeLeft,
  omit,
  path,
  pathEq,
  pathOr,
  pick,
  pipe,
  prop,
  propEq,
  propOr,
  reverse,
  sum,
  sortBy,
  sortWith,
  tail,
  take,
  takeLast,
} = require('ramda');

const ApiRequest = require('../../libs/api/api')
const DataLoader = require('dataloader')

// Definitions
const professionalLeagueIds = [133];
const isSeasonProfessional = pipe(
	pathOr(null, ['league', 'id']),
	leagueId => contains(leagueId, professionalLeagueIds)
)

// NHL = 133
// AHL = 153
// International leagues have no id, so we have to use the names
// WJC-A
// WC-A
// Olympics
const internationalLeagueNames = ['WJC-A', 'WC-A', 'Olympics'];
const isInternational = pipe(
	pathOr(null, ['league', 'name']),
	leagueName => contains(leagueName, internationalLeagueNames)
)


// Player schema

const batchPlayerBioFetcher = async (playerIds) => {
  const data = await Promise.all(playerIds.map((id) => {
  	return new ApiRequest({ 
  		league: 'NHL', 
  		apiType: 'STATS_API', 
  		resource: `/people/${id}` 
  	}).fetch()
  }))
  
  return map(path(['people', 0]))(data)
}

const playerBioLoader = new DataLoader(ids => batchPlayerBioFetcher(ids))

const batchPlayerDraftFetcher = async (playerIds) => {
	const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'RECORDS_API',
			resource: `/draft?cayenneExp=playerId=${id}`,
		}).fetch()
	}))

  return map(path(['data', 0]))(data)
};

const playerDraftLoader = new DataLoader(ids => batchPlayerDraftFetcher(ids))

const batchCareerStatsFetcher = async (playerIds) => {
	const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'RECORDS_API',
			resource: `/people/${id}/stats?stats=yearByYear`,
		}).fetch()
	}))

	return data.map((player) => {
		const professionalSeasons = pipe(
			path(['stats', 0, 'splits']), 
			filter(isSeasonProfessional)
		)(player);
	  const internationalCompetitions = pipe(
	  	path(['stats', 0, 'splits']), 
	  	filter(isInternational)
	  )(player);
	  // if pro, return nhl seasons and international competitions only
	  if (professionalSeasons.length) {
	    return [
	    	...internationalCompetitions, 
	    	...professionalSeasons
	    ];
	  }
	  // if not, return everything we have
	  return pathOr([], ['stats', 0, 'splits'], data);
	})
}

const playerCareerSeasonStatsLoader = new DataLoader(ids => batchCareerStatsFetcher(ids))

const batchCareerPlayoffsStatsFetcher = async (playerIds) => {
  const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'RECORDS_API',
			resource: `/people/${id}/stats?stats=yearByYearPlayoffs`,
		}).fetch()
	}))

  return pipe(
  	pathOr([], ['stats', 0, 'splits']), 
  	filter(isSeasonProfessional), 
  )(data)
}

const playerCareerPlayoffsStatsLoader = new DataLoader(ids => batchCareerStatsFetcher(ids))

const batchPlayerSeasonGameLogsFetcher = async (playerIds) => {
	const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/people/${id}/stats?stats=gameLog`,
		}).fetch()
	}))

	return map(path(['stats', 0, 'splits']))(data)
}

const playerSeasonGameLogsLoader = new DataLoader(ids => batchPlayerSeasonGameLogsFetcher(ids))

const batchPlayerPlayoffsGameLogsFetcher = async (playerIds) => {
	const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/people/${id}/stats?stats=playoffGameLog`,
		}).fetch()
	}))

	return map(path(['stats', 0, 'splits']))(data)
}

const playerPlayoffsGameLogsLoader = new DataLoader(ids => batchPlayerPlayoffsGameLogsFetcher(ids))

// Players
// const fetchAllHistoryPlayers = async () => {
//   const resourceSkaters = '/skaters?isAggregate=true&reportType=basic&reportName=bios&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]&cayenneExp=seasonId%3E=19171918%20and%20seasonId%3C=20192020';
//   const resourceGoalies = '/goalies?isAggregate=true&reportType=goalie_basic&reportName=goaliebios&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]&cayenneExp=seasonId%3E=19171918%20and%20seasonId%3C=20192020';
//   const [skaters, goalies] = await Promise.all([
//     nhlApi(resourceSkaters, 60 * 60 * 24 * 7),
//     nhlApi(resourceGoalies, 60 * 60 * 24 * 7),
//   ]);

//   const test = [...skaters.data, ...goalies.data];

//   return test;
// };

// const fetchPlayersReport = async (season = 20192020) => {
//   const skatersummaryRookie = `/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}&sort=[{%22property%22:%22playerId%22}]`;
//   const realtimeRookie = `/skaters?isAggregate=false&reportType=basic&reportName=realtime&sort=[{%22property%22:%22playerId%22}]&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`;
//   const goaliesRookie = `/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary&sort=[{%22property%22:%22playerId%22}]&cayenneExp=playerRookieSeasonInd=1%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`;
//   const goaliesAll = `/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary&sort=[{%22property%22:%22playerId%22}]&cayenneExp=playerRookieSeasonInd=1%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`;
//   const skatersummaryAll = `/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`;
//   const realtimeAll = `/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`;

//   try {
//     const [
//       skatersummaryRookieJSON,
//       skatersummaryAllJSON,
//       realtimeRookieJSON,
//       realtimeAllJSON,
//       goaliesRookieJSON,
//       goaliesAllJSON,
//     ] = await Promise.all([
//       nhlApi(skatersummaryRookie, 60 * 60 * 24),
//       nhlApi(skatersummaryAll, 60 * 60 * 24),
//       nhlApi(realtimeRookie, 60 * 60 * 24),
//       nhlApi(realtimeAll, 60 * 60 * 24),
//       nhlApi(goaliesRookie, 60 * 60 * 24),
//       nhlApi(goaliesAll, 60 * 60 * 24),
//     ]);
//     return pipe(
//       map(prop('data')),
//       ([arr1, arr2, arr3, arr4, arr5, arr6]) => {
//         const rookiePlayerIds = map(prop('playerId'), arr1);
//         const goalieRookieIds = map(prop('playerId'), arr5);
//         return [
//           ...arr1.map((item, k) => mergeLeft(arr1[k], { ...arr3[k], rookie: true })),
//           ...arr2.map((item, k) => ({ ...item, ...arr4[k], rookie: false }))
//             .filter(item => !rookiePlayerIds.includes(item.playerId)),
//           ...arr5.map((item, k) => ({ ...arr5[k], rookie: true })),
//           ...arr6.map((item, k) => ({ ...item, rookie: false }))
//             .filter(item => !goalieRookieIds.includes(item.playerId)),
//         ];
//       },
//     )([
//       skatersummaryRookieJSON,
//       skatersummaryAllJSON,
//       realtimeRookieJSON,
//       realtimeAllJSON,
//       goaliesRookieJSON,
//       goaliesAllJSON,
//     ]);
//   } catch (e) {
//     console.error(e);
//     return [];
//   }
// };

// TODO: hardcoded feature flag lol
// const IS_PLAYOFFS_TIME = false;

// const fetchStatsForTeamId = async (teamId) => {
//   const resource = `/teams/${teamId}/stats?stats=statsSingleSeason`;
//   const teamInfo = await nhlStatsApi(resource, 60 * 60);
//   let stats = path(['stats', 0], teamInfo);
//   if (!stats) {
//     teamInfo = await nhlStatsApi(resource, 60 * 60);
//     stats = path(['stats', 0], teamInfo);
//   }
//   return stats;
// };

// const fetchInfoForTeamId = async (teamId) => {
//   const resource = `/teams/${teamId}`;
//   const teamInfo = await nhlStatsApi(resource);
//   return path(['teams', 0], teamInfo);
// };

// const fetchPlayersForTeamId = async (teamId, args) => {
//   let resource = `/teams/${teamId}/roster`;
//   if (args && args.season) {
//     resource += `?season=${args.season}`;
//   }
//   const json = await nhlStatsApi(resource);
//   const allRosterIds = map(path(['person', 'id']), json.roster);
//   const playerInfo = mergeAll(json.roster.map(p => ({ [p.person.id]: { ...p } })));
//   const fullData = allRosterIds.map(id => ({
//     teamId, id, ...playerInfo[id],
//   }));
//   return fullData;
// };

// const fetchAllTeams = async (args) => {
//   let resource = '/teams';
//   if (args && args.season) {
//     resource += `?season=${args.season}`;
//   }
//   const allTeamsData = await nhlStatsApi(resource, 60 * 60 * 24 * 300);
//   return prop('teams', allTeamsData);
// };

// const fetchAllPlayers = async (args) => {
//   const allTeamsData = await fetchAllTeams(args);
//   const allTeamsIds = map(prop('id'), allTeamsData);
//   const promises = map(id => fetchPlayersForTeamId(id, args), allTeamsIds);
//   const allTeamsRosters = await Promise.all(promises);
//   return flatten(allTeamsRosters);
// };

// const fetchStandings = async () => {
//   const standingsResponse = await nhlStatsApi('/standings/wildCardWithLeaders?expand=standings.record', 60 * 60);
//   const standings = prop('records', standingsResponse);
//   return standings;
// };

// const fetchGames = async (args) => {
//   let resource = '/schedule';
//   let cacheExp = 60 * 60;
//   if (args.date) {
//     resource += `?date=${args.date}`;
//     if (moment(args.date).subtract(1, 'day').isBefore(moment())) {
//       cacheExp = 60 * 60 * 24 * 300;
//     }
//   } else {
//     resource += `?date=${moment().format('YYYY-MM-DD')}`;
//   }

//   if (IS_PLAYOFFS_TIME) {
//     resource += '&hydrate=game(seriesSummary),seriesSummary(series)';
//   }
//   const gamesResponse = await nhlStatsApi(resource, cacheExp || 60);
//   const games = flatten(map(propOr({}, 'games'), gamesResponse.dates || []));
//   return games;
// };

// const fetchBoxscore = async (gameId) => {
//   const resource = `/game/${gameId}/boxscore`;
//   const boxscoreResponse = await nhlStatsApi(resource, 60);
//   return {
//     id: gameId,
//     ...prop('teams', boxscoreResponse),
//   };
// };

// const fetchLiveFeed = async (gameId) => {
//   const resource = `/game/${gameId}/feed/live`;
//   const liveFeedResponse = await nhlStatsApi(resource, 60);
//   return {
//     id: gameId,
//     ...liveFeedResponse,
//   };
// };

// const fetchTeamRanking = async (teamId) => {
//   const standingsResponse = await nhlStatsApi('/standings', 60 * 60);
//   const teamStanding = pipe(
//     map(o => o.teamRecords.map(t => ({ conference: o.conference, division: o.division, ...t }))),
//     flatten,
//     filter(pathEq(['team', 'id'], teamId)),
//     head,
//   )(standingsResponse.records);

//   return {
//     conference: teamStanding.conferenceRank,
//     conferenceName: teamStanding.conference.name,
//     division: teamStanding.divisionRank,
//     divisionName: teamStanding.division.name,
//     league: teamStanding.leagueRank,
//   };
// };

// const fetchDraft = async (args) => {
//   const resource = `/draft?cayenneExp=draftYear=${args.year}`;
//   const draftResponse = await nhlRecordsApi(resource, 60 * 60 * 24 * 300);
//   return draftResponse.data;
// };

// const fetchGameHighlights = async (id) => {
//   try {
//     const resource = `/game/${id}/content`;
//     const gameContentResponse = await nhlStatsApi(resource, 60 * 60);
//     const goalHighlightsUrls = map(
//       o => ({
//         ...pick([
//           'statsEventId',
//           'periodTime',
//           'period',
//         ], o),
//         url: pipe(
//           pathOr([], ['highlight', 'playbacks']),
//           last,
//           pathOr('', ['url']),
//         )(o),
//       }),
//       filter(o => o.type === 'GOAL', pathOr([], ['media', 'milestones', 'items'], gameContentResponse)),
//     );
//     const gameRecapUrl = pipe(
//       pathOr([], ['media', 'epg']),
//       find(propEq('title', 'Recap')),
//       propOr([], ['items']),
//       last,
//       propOr({}, ['playbacks']),
//       last,
//       prop(['url']),
//     )(gameContentResponse);
//     return {
//       recap: gameRecapUrl,
//       goals: goalHighlightsUrls,
//     };
//   } catch (e) {
//     console.error(e);
//   }
// };

// const teamStreakDefaultNumberOfGames = 15;
// const playerStreakDefaultNumberOfGames = 5;
// const defaultTeamsLimit = 10;
// const defaultPlayersLimit = 5;

// const takeHomeTeam = path(['teams', 'home']);
// const takeAwayTeam = path(['teams', 'away']);

// const calculateTeamPointsStreak = (team) => {
//   const gamesToConsider = pipe(
//     prop('schedule'),
//     map(prop('game')),
//     filter(game => game.gameType === 'R'),
//     reverse,
//     take(teamStreakDefaultNumberOfGames + 1)
//   )(team);

//   const goalsFor = pipe(
//     tail,
//     map(game => (game.teams.home.team.id === team.id ? takeHomeTeam(game) : takeAwayTeam(game))),
//     map(prop('score')),
//     sum,
//   )(gamesToConsider);

//   const goalsAgainst = pipe(
//     tail,
//     map(game => (game.teams.home.team.id !== team.id ? takeHomeTeam(game) : takeAwayTeam(game))),
//     map(prop('score')),
//     sum,
//   )(gamesToConsider);

//   const firstGame = last(gamesToConsider);
//   const lastGame = head(gamesToConsider);


//   let initialRecord = { wins: 0, losses: 0, ot: 0, type: 'league' }
//   let latestRecord  = { wins: 0, losses: 0, ot: 0, type: 'league' }

//   if (gamesToConsider.length > 1) {
//     latestRecord = lastGame.teams.home.team.id === team.id
//       ? lastGame.teams.home.leagueRecord
//       : lastGame.teams.away.leagueRecord;
//   }

//   if (gamesToConsider.length > teamStreakDefaultNumberOfGames) {
//     initialRecord = firstGame.teams.home.team.id === team.id
//       ? firstGame.teams.home.leagueRecord
//       : firstGame.teams.away.leagueRecord;
//   }

//   const streak = {
//     wins: latestRecord.wins - initialRecord.wins,
//     losses: latestRecord.losses - initialRecord.losses,
//     ot: latestRecord.ot - initialRecord.ot,
//     games: teamStreakDefaultNumberOfGames,
//     isValid: latestRecord.wins >= initialRecord.wins,
//     goalsAgainst,
//     goalsFor,
//   };

//   return {
//     ...team,
//     streak: {
//       ...streak,
//       points: Math.round(streak.wins * 2 + streak.ot),
//     },
//   };
// };

// const calculatePlayerPointsStreak = player => ({
//   ...player,
//   streak: {
//     points: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'points'])),
//       sum,
//     )(player),
//     goals: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'goals'])),
//       sum,
//     )(player),
//     assists: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'assists'])),
//       sum,
//     )(player),
//     shots: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'shots'])),
//       sum,
//     )(player),
//     hits: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'hits'])),
//       sum,
//     )(player),
//     pim: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'penaltyMinutes'])),
//       sum,
//     )(player),
//     powerPlayPoints: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'powerPlayPoints'])),
//       sum,
//     )(player),
//     plusMinus: pipe(
//       prop('logs'),
//       take(playerStreakDefaultNumberOfGames),
//       map(path(['stat', 'plusMinus'])),
//       sum,
//     )(player),
//     games: playerStreakDefaultNumberOfGames,
//   },
// });

// const fetchTeamSchedule = async (teamId) => {
//   const resource = `/schedule?teamId=${teamId}&startDate=2019-09-01&endDate=${moment.tz('America/New_York').subtract(1, 'day').endOf('day').format('YYYY-MM-DD')}`;
//   const teamSchedule = await nhlStatsApi(resource);
//   return teamSchedule.dates.map(date => ({ date: date.date, game: date.games[0] }));
// };

// const calculateTeamsStreaks = async (args = {}) => {
//   try {
//     const cached = await cache.get('team_streaks');
    
//     // if (cached && !args.forced) {
//     //   return take(args.limit || defaultTeamsLimit, JSON.parse(cached));
//     // }

//     const teams = await fetchAllTeams();
//     const teamsRelevantInformation = map(pick(['id', 'name', 'teamName', 'abbreviation']), teams);

//     const teamsWithSchedules = await Promise.all(
//       teamsRelevantInformation.map(async team => ({
//         ...team,
//         schedule: await fetchTeamSchedule(team.id),
//       })),
//     );

//     // get game logs for all players
//     const teamsStreaks = pipe(
//       map(calculateTeamPointsStreak),
//       filter(team => team.streak.isValid),
//       sortWith([
//         descend(path(['streak', 'points'])),
//       ]),
//       map(omit(['schedule'])),
//     )(teamsWithSchedules);

//     console.log(`Saving streaks for the next ${(getSecondsUntilMidnight() / 60 / 60).toFixed(1)} hours`);
//     cache
//       .set(
//         'team_streaks',
//         JSON.stringify(teamsStreaks),
//         'EX',
//         getSecondsUntilMidnight(),
//       );

//     return take(args.limit || defaultTeamsLimit, teamsStreaks);
//   } catch (e) {
//     console.error(e);
//   }
// };

// const fetchByTen = async (cumulative, players) => {
//   const batch = take(10, players);
//   console.log(cumulative.length, players.length);
//   const responses = await Promise.all(batch.map(async (p) => {
//     const logs = await fetchGameLogsForPlayerId(p.playerId);
//     return {
//       ...p,
//       logs,
//     };
//   }));
//   const newCumulative = [...cumulative, ...responses];
//   if (players.length <= 10) {
//     return newCumulative;
//   }
//   const final = await fetchByTen(newCumulative, takeLast(players.length - 10, players));
//   return final;
// };

// const calculatePlayerStreaks = async (args = {}) => {
//   try {
//     const cached = await cache.get('players_streaks');
//     if (cached && !args.forced) {
//       return take(args.limit || defaultPlayersLimit, JSON.parse(cached));
//     }
//     const skatersummaryAll = '/skaters?isAggregate=false&reportType=basic&reportName=skatersummary&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20192020%20and%20seasonId%3C=20192020&sort=[{%22property%22:%22playerId%22}]';

//     const players = await nhlApi(skatersummaryAll, 60 * 60 * 24);

//     // get game logs for all players
//     const playersLogs = await fetchByTen([], players.data);
//     console.log(`${playersLogs.length} players have logs`);

//     // calculate streaks
//     const streaks = pipe(
//       map(calculatePlayerPointsStreak),
//       sortWith([
//         descend(path(['streak', 'points'])),
//         descend(path(['streak', 'goals'])),
//       ]),
//       map(omit(['logs'])),
//     )(playersLogs);
//     console.log(`Saving streaks for the next ${getSecondsUntilMidnight() / 60 / 60} hours`);
//     cache
//       .set(
//         'players_streaks',
//         JSON.stringify(streaks),
//       );

//     return take(args.limit || defaultPlayersLimit, streaks);
//   } catch (e) {
//     console.error(e);
//   }
// };

module.exports = {
	playerBioLoader,
	playerDraftLoader,
	playerCareerSeasonStatsLoader,
	playerCareerPlayoffsStatsLoader,
	playerSeasonGameLogsLoader,
	playerPlayoffsGameLogsLoader
}