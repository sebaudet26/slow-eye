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
} = require('ramda')
const moment = require('moment-timezone')
const DataLoader = require('dataloader')

const ApiRequest = require('../../libs/api/api')
const cache = require('../../libs/redis')

const {
	calculateTeamPointsStreak,
	calculatePlayerPointsStreak,
} = require('../helpers/nhl/streaks')

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
	    	// ...internationalCompetitions,
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

	return map(pathOr([], ['stats', 0, 'splits']))(data)
}

const playerSeasonGameLogsLoader = new DataLoader(batchPlayerSeasonGameLogsFetcher)

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
  const totalPlayers = await cache.instance.get('total_players') || 7192
  const totalGoalies = await cache.instance.get('total_goalies') || 810

  // const cached_value = await cache.instance.get('players_list:' + seasons.join(','))
  // if (cached_value) {
  //   return JSON.parse(cached_value)
  // }

	const data = await Promise.all(seasons.map((season) => {
		const seasonStart = season == 'all' ? '19171918' : season
		const seasonEnd = season == 'all' ? CURRENT_SEASON : season


    const playerIntervals = parseInt(totalPlayers / 100) + 1
    const goalieIntervals = parseInt(totalGoalies / 100) + 1

    const requests = new Array(playerIntervals + goalieIntervals)

    for (let i = 0; i<playerIntervals; i++) {
      requests.push(new ApiRequest({
        league: 'NHL',
        apiType: 'BASIC',
        resource: `/en/skater/bios?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22birthDate%22,%22direction%22:%22ASC_CI%22%7D,%7B%22property%22:%22skaterFullName%22,%22direction%22:%22ASC_CI%22%7D%5D&start=${i*100}&limit=100&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${seasonEnd}%20and%20seasonId%3E=${seasonStart}`
      }))
    }
    for (let i = 0; i<goalieIntervals; i++) {
      requests.push(new ApiRequest({
        league: 'NHL',
        apiType: 'BASIC',
        resource: `/en/goalie/bios?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22birthDate%22,%22direction%22:%22ASC_CI%22%7D,%7B%22property%22:%22goalieFullName%22,%22direction%22:%22ASC_CI%22%7D%5D&start=${i*100}&limit=100&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${seasonEnd}%20and%20seasonId%3E=${seasonStart}`
      }))
    }

		return Promise
    .all(requests.map(request => request.fetch()))
		.then((seasonData) => {
			return Promise.resolve(pipe(
				map(pathOr([], ['data'])),
				flatten,
				map(pick(['skaterFullName', 'goalieFullName', 'birthDate', 'playerId', 'nationalityCode', 'positionCode'])),
			)(seasonData))
		})
	}))

  cache.instance.set('players_list:' + seasons.join(','), JSON.stringify(data))

	return data
}

const reportFetcher = async (season, type) => {
	switch (type) {
		case 'skaters':
	  	const skaters = await new ApiRequest({
				league: 'NHL',
				apiType: 'BASIC',
				resource: `/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=100&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`,
			})
      .fetch()

      return pathOr([], ['data'])(skaters)

		case 'goalies':
	  	const goalies = await new ApiRequest({
				league: 'NHL',
				apiType: 'BASIC',
				resource: `/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22wins%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22savePct%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=100&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=3%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`,
			})
      .fetch()

			return pathOr([], ['data'])(goalies)
	}
}

const batchReportFetcher = async (ids) => {
	const data = await Promise.all(ids.map((id) => {
		const [season, type] = id.split(':')
		return reportFetcher(season, type)
	}))
	return data
}

// Team -----

const batchTeamInfoFetcher = async (teamIds) => {
	 const data = await Promise.all(teamIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/teams/${id}`,
		}).fetch()
	}))

	return map(pathOr({}, ['teams', 0]), data)
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

	return map(pathOr([], ['records']), data)
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
  console.log('dates', dates)
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

const defaultTeamsLimit = 10;
const defaultPlayersLimit = 5;

const batchTeamScheduleFetcher = async (teamIds) => {
	const endDate = process.env.NODE_ENV == 'test'
		? '2019-10-13'
		: `${moment.tz('America/New_York').subtract(1, 'day').endOf('day').format('YYYY-MM-DD')}`

	const data = await Promise.all(teamIds.map((id) => {
		return new ApiRequest({
			league: 'NHL',
			apiType: 'STATS_API',
			resource: `/schedule?teamId=${id}&startDate=${CURRENT_YEAR}-09-01&endDate=${endDate}`,
		}).fetch()
	}))

  return data.map((team) => {
  	return pipe(
  		propOr([], 'dates'),
  		map(date => ({ date: date.date, game: date.games[0] }))
  	)(team)
  })
}

const teamScheduleLoader = new DataLoader(batchTeamScheduleFetcher)

const calculateTeamsStreaks = async () => {
	const cached_value = await cache.instance.get('team_streaks')
	if (cached_value) {
		return JSON.parse(cached_value)
	}

  const teams = await new ApiRequest({
		league: 'NHL',
		apiType: 'STATS_API',
		resource: `/teams?season=${CURRENT_SEASON}`,
	})
	.fetch()
	.then((data) => Promise.resolve(propOr([], 'teams')(data)))
	.then((teams) => map(pick(['id', 'name', 'teamName', 'abbreviation']))(teams))

  const teamsWithSchedules = await Promise.all(teams.map(async team => ({
    ...team,
    schedule: await teamScheduleLoader.load(team.id),
  })))

  const teamsStreaks = pipe(
    map(calculateTeamPointsStreak),
    sortWith([descend(path(['streak', 'points']))]),
    map(omit(['schedule'])),
  )(teamsWithSchedules)

	cache.instance.set('team_streaks', JSON.stringify(teamsStreaks))

  return teamsStreaks;
}

const fetchByBatchOf = (batchSize) => async (cumulative, players) => {
  console.log(`${players.length} remaining`)
  const batch = take(batchSize, players);

  const responses = await Promise.all(batch.map(async (p) => {
    let logs
    try {
      logs = await playerSeasonGameLogsLoader.load(p.playerId);
    } catch(e) {
      logs = {}
    }
    return {
      ...p,
      logs,
    };
  }));
  const newCumulative = [...cumulative, ...responses];
  if (players.length <= batchSize) {
    return newCumulative;
  }
  await new Promise(r => setTimeout(r, 500))
  const final = await fetchByBatchOf(10)(newCumulative, takeLast(players.length - batchSize, players));

  return final;
};

const playersLoader = new DataLoader(playersFetcher)

const calculatePlayerStreaks = async () => {
	const cached_value = await cache.instance.get('player_streaks')
	if (cached_value) {
		return JSON.parse(cached_value)
	}

  const response = await playersLoader.load(CURRENT_SEASON)

  // get game logs for all players
  console.log(`need to fetch logs for ${response.length} players`)
  const playersLogs = await fetchByBatchOf(10)([], response);

  // calculate streaks
  const streaks = pipe(
    map(calculatePlayerPointsStreak),
    sortWith([
      descend(path(['streak', 'points'])),
      descend(path(['streak', 'goals'])),
    ]),
    map(pick(['playerId', 'streak', 'skaterFullName', 'playerTeamsPlayedFor', 'positionCode'])),
  )(playersLogs)

  // cache streaks
	cache.instance.set('player_streaks', JSON.stringify(streaks))

  return streaks
}


const batchStreaksFetcher = async (streakTypes) => {
	return Promise.all(streakTypes.map((type) => {
		switch (type) {
			case 'teams':
			return calculateTeamsStreaks()

			case 'players':
			return calculatePlayerStreaks()
		}
	}))
}



module.exports = {
	playerBioLoader: new DataLoader(batchPlayerBioFetcher),
	playerDraftLoader: new DataLoader(batchPlayerDraftFetcher),
	playerCareerSeasonStatsLoader: new DataLoader(batchCareerStatsFetcher),
	playerCareerPlayoffsStatsLoader: new DataLoader(batchCareerPlayoffsStatsFetcher),
	playerSeasonGameLogsLoader,
	playerPlayoffsGameLogsLoader: new DataLoader(batchPlayerPlayoffsGameLogsFetcher),

	playersLoader,
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

	streakLoader: new DataLoader(batchStreaksFetcher),
}