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

const {
	calculateTeamPointsStreak
} = require('./nhlHelpers')


// Definitions
const CURRENT_SEASON = '20192020'
const CURRENT_YEAR = '2019'

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


// Player -----

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

const batchCareerStatsFetcher = async (playerIds) => {
	const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
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

const batchCareerPlayoffsStatsFetcher = async (playerIds) => {
  const data = await Promise.all(playerIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/people/${id}/stats?stats=yearByYearPlayoffs`,
		}).fetch()
	}))

  return map(pipe(
  	pathOr([], ['stats', 0, 'splits']), 
  	filter(isSeasonProfessional), 
  ))(data)
}

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

// Players -----

const playersFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		const seasonStart = season == 'all' ? '19171918' : season
		const seasonEnd = season == 'all' ? CURRENT_SEASON : season
		return Promise.all([
			new ApiRequest({
				league: 'NHL',
				apiType: 'BASIC',
				resource: '/skaters?isAggregate=true&reportType=basic&reportName=bios' +
									'&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]' +
									`&cayenneExp=seasonId%3E=${seasonStart}%20and%20seasonId%3C=${seasonEnd}`,
			}).fetch(),
			new ApiRequest({
				league: 'NHL',
				apiType: 'BASIC',
				resource: '/goalies?isAggregate=true&reportType=goalie_basic&reportName=goaliebios' +
									'&sort=[{%22property%22:%22playerBirthDate%22,%22direction%22:%22DESC%22}]' +
									`&cayenneExp=seasonId%3E=${seasonStart}%20and%20seasonId%3C=${seasonEnd}`,
			}).fetch(),
		])
		.then((seasonData) => {
			return Promise.resolve(pipe(
				flatten,
				map(pathOr([], ['data'])),
				map(pick(['playerBirthDate', 'playerName', 'playerId', 'playerNationality', 'playerPositionCode'])),
			)(seasonData))
		})
	}))

	return data
}

const reportFetcher = async (season, type) => {
	switch (type) {
		case 'skaters':
  		return await Promise.all([
  			// rookies
	  		'/skaters?isAggregate=false&reportType=basic&reportName=skatersummary' +
	  		'&sort=[{%22property%22:%22playerId%22}]',
	  		`&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}` +

	  		'/skaters?isAggregate=false&reportType=basic&reportName=realtime' +
	  		'&sort=[{%22property%22:%22playerId%22}]' +
	  		`&cayenneExp=playerRookieSeasonInd=1%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`,

	  		// all players
	  		'/skaters?isAggregate=false&reportType=basic&reportName=skatersummary' +
	  		'&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22}]' +
	  		`&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`,

	  		'/skaters?isAggregate=false&reportType=basic&reportName=realtime' + 
	  		'&sort=[{%22property%22:%22playerId%22}]' +
	  		`&cayenneExp=gameTypeId=2%20and%20gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}`,

	  	].map((resource) => {
	  		return new ApiRequest({
					league: 'NHL',
					apiType: 'BASIC',
					resource,
				}).fetch()
			}))
			.then((arr) => Promise.resolve(map(map(pathOr([], ['data'])), arr)))
			.then(([rookieSummary, rookieRealtime, allSummary, allRealtime]) => {
  			const rookiesPlayerIds = map(prop('playerId'), rookieSummary);
  			return Promise.resolve([
					rookieSummary.map((item, k) => mergeLeft(rookieSummary[k], { ...rookieRealtime[k], rookie: true })),
          allSummary.filter(item => !rookiesPlayerIds.includes(item.playerId))
          	.map((item, k) => mergeLeft(allSummary[k], { ...allRealtime[k], rookie: false })),
  			])
			})


		case 'goalies':
			return await Promise.all([
				'/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary' +
				'&sort=[{%22property%22:%22playerId%22}]' +
				`&cayenneExp=playerRookieSeasonInd=1%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`,

				'/goalies?isAggregate=false&reportType=goalie_basic&reportName=goaliesummary' +
				'&sort=[{%22property%22:%22playerId%22}]' +
				`&cayenneExp=gameTypeId=2%20and%20seasonId%3E=${season}%20and%20seasonId%3C=${season}%20and%20gameTypeId=2`,
			].map((resource) => {
	  		return new ApiRequest({
					league: 'NHL',
					apiType: 'BASIC',
					resource,
				}).fetch()
			}))
			.then((arr) => Promise.resolve(map(map(pathOr([], ['data'])), arr)))
			.then(([rookies, all]) => {
		    const rookiesPlayerIds = map(prop('playerId'), rookies);
        return Promise.resolve([
          ...rookies.map((item, k) => ({ ...rookies[k], rookie: true })),
          ...all.filter(item => !rookiesPlayerIds.includes(item.playerId))
          	.map((item, k) => ({ ...item, rookie: false }))
        ]);
			})
	}
}

const batchReportFetcher = async (ids) => {
	const data = await Promise.all(ids.map((id) => {
		const [season, type] = id.split(':')
		return reportFetcher(season, type)
	}))

	return flatten(data)
}

// TODO: hardcoded feature flag lol
// const IS_PLAYOFFS_TIME = false;

// Team -----

const batchTeamInfoFetcher = async (teamIds) => {
	 const data = await Promise.all(teamIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/teams/${id}`,
		}).fetch()
	}))

	return map(propOr([], 'teams'), data)
}

const batchTeamStatsFetcher = async (ids) => {
	const data = await Promise.all(ids.map((id) => {
		const [season, teamId] = id.split(':')
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/teams/${teamId}/stats?stats=statsSingleSeason&season=${season}`,
		}).fetch()
	}))

	return data.map((teamStats) => {
		return {
			stats: pathOr({}, ['stats', 0, 'splits', 0, 'stat'], teamStats),
			rankings: pathOr({}, ['stats', 1, 'splits', 0, 'stat'], teamStats),
		}
	})
}

const batchTeamRosterFetcher = async (ids) => {
	const data = await Promise.all(ids.map((id) => {
		const [season, teamId] = id.split(':')
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/teams/${teamId}/roster?season=${season}`,
		}).fetch()
	}))
	
	const rosters = map(propOr([], 'roster'), data)

	return rosters.map((roster) => {
		return roster.map((player) => {
			return {
				...player.person,
				jerseyNumber: player.jerseyNumber,
				position: player.position,
			}
		})
	})
}

// Teams -----

const batchTeamsFetcher = async (seasons) => {
  const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/teams?season=${season}`,
		}).fetch()
	}))

	return map(propOr([], 'teams'), data)
}

const batchTeamStandingsFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/standings/wildCardWithLeaders?expand=standings.record&season=${season}`,
		}).fetch()
	}))

	return map(pathOr([], ['records', 0]), data)	
}


// Game -----

const batchGameBoxscoreFetcher = async (gameIds) => {
	const data = await Promise.all(gameIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/game/${id}/boxscore`,
			expiraion: 60
		}).fetch()
	}))

	return map(propOr({}, 'teams'), data)
}

const batchGameLivefeedFetcher = async (gameIds) => {
	const data = await Promise.all(gameIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/game/${id}/feed/live`,
			expiration: 60
		}).fetch()
	}))

	return data	
}

const batchGameHighlightsFetcher = async (gameIds) => {
	const data = await Promise.all(gameIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/game/${id}/content`,
			expiration: 60
		}).fetch()
	}))

  const getHighlightsFromGame = (type = 'GOAL') => pipe(
  	pathOr([], ['media', 'milestones', 'items']),
  	filter(o => o.type === type),
  	map(
	    o => ({
	      ...pick(['statsEventId', 'periodTime', 'period',])(o),
	      url: pipe(
	        pathOr([], ['highlight', 'playbacks']),
	        last,
	        pathOr('', ['url']),
	      )(o),
    	}),
    ),
  );

  const getRecapFromGame = pipe(
    pathOr([], ['media', 'epg']),
    find(propEq('title', 'Recap')),
    propOr([], ['items']),
    last,
    propOr({}, ['playbacks']),
    last,
    prop(['url']),
  );

  return map(game => ({
    recap: getRecapFromGame(game),
    goalsHighlights: getHighlightsFromGame()(game),
  }), data);
}

// Games -----

const batchGamesScheduleFetcher = async (dates) => {
	const data = await Promise.all(dates.map((date) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/schedule?date=${date}`,
			expiration: 60
		}).fetch()
	}))

	return map(pathOr([], ['dates', 0, 'games']))(data)
}

// Streaks -----

const emptyRecord = { wins: 0, losses: 0, ot: 0 }
const teamStreakDefaultNumberOfGames = 15;
const playerStreakDefaultNumberOfGames = 5;
const defaultTeamsLimit = 10;
const defaultPlayersLimit = 5;
const takeHomeTeam = path(['teams', 'home']);
const takeAwayTeam = path(['teams', 'away']);
	
const batchTeamScheduleFetcher = async (teamIds) => {
	const endDate = `${moment.tz('America/New_York').subtract(1, 'day').endOf('day').format('YYYY-MM-DD')}`
	const data = await Promise.all(teamIds.map((id) => {
		new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/schedule?teamId=${teamId}&startDate=${CURRENT_YEAR}-09-01&endDate=${endDate}`,
		}).fetch()
	}))
  
  return teamSchedule.dates.map(date => ({ date: date.date, game: date.games[0] }));
}

const teamScheduleLoader = new DataLoader(batchTeamScheduleFetcher)

const calculateTeamsStreaks = async () => {
	const cached = await cache.get('team_streaks')
    
  if (cached) {
    return take(args.limit || defaultTeamsLimit, JSON.parse(cached));
  }

  const teams = await new ApiRequest({
		league: 'NHL',
		apiType: 'STATS_API',
		resource: `/teams?season=${CURRENT_SEASON}`,
	})
	.fetch()
	.then((data) => Promise.resolve(propOr([], 'teams')))
	.then((teams) => map(pick(['id', 'name', 'teamName', 'abbreviation'])))

  const teamsWithSchedules = await Promise.all(teams.map(async team => ({
    ...team,
    schedule: await teamScheduleLoader.load(team.id),
  })))

  const teamsStreaks = pipe(
    map(calculateTeamPointsStreak),
    filter(team => team.streak.isValid),
    sortWith([descend(path(['streak', 'points']))]),
    map(omit(['schedule'])),
  )(teamsWithSchedules)

  console.log('Caching streaks')

  cache
    .set(
      'team_streaks',
      JSON.stringify(teamsStreaks),
      'EX',
      getSecondsUntilMidnight(),
    )

  return take(args.limit || defaultTeamsLimit, teamsStreaks);
}



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

// const fetchDraft = async (args) => {
//   const resource = `/draft?cayenneExp=draftYear=${args.year}`;
//   const draftResponse = await nhlRecordsApi(resource, 60 * 60 * 24 * 300);
//   return draftResponse.data;
// };

module.exports = {

	playerBioLoader: new DataLoader(batchPlayerBioFetcher),
	playerDraftLoader: new DataLoader(batchPlayerDraftFetcher),
	playerCareerSeasonStatsLoader: new DataLoader(batchCareerStatsFetcher),
	playerCareerPlayoffsStatsLoader: new DataLoader(batchCareerPlayoffsStatsFetcher),
	playerSeasonGameLogsLoader: new DataLoader(batchPlayerSeasonGameLogsFetcher),
	playerPlayoffsGameLogsLoader: new DataLoader(batchPlayerPlayoffsGameLogsFetcher),

	playersLoader: new DataLoader(playersFetcher),
	playersReportLoader: new DataLoader(batchReportFetcher),

	teamInfoLoader: new DataLoader(batchTeamInfoFetcher),
	teamStatsLoader: new DataLoader(batchTeamStatsFetcher),
	teamRosterLoader: new DataLoader(batchTeamRosterFetcher),

	teamsLoader: new DataLoader(batchTeamsFetcher),
	teamsStandingsLoader: new DataLoader(batchTeamStandingsFetcher),

	gameBoxscoreLoader: new DataLoader(batchGameBoxscoreFetcher),
	gameLivefeedLoader: new DataLoader(batchGameLivefeedFetcher),
	gameHighlightsLoader: new DataLoader(batchGameHighlightsFetcher),

	gamesScheduleLoader: new DataLoader(batchGamesScheduleFetcher),

	calculateTeamsStreaks: new DataLoader(calculateTeamsStreaks, { batch: false })
}