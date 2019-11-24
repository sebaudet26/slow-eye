const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const {
  pipe,
  prop,
  map,
  pathOr,
  sum,
  path,
  lte,
  equals,
  take,
} = require('ramda')

const {
	playerBioLoader,
  playerDraftLoader,
	playerCareerSeasonStatsLoader,
  playerCareerPlayoffsStatsLoader,
	playerSeasonGameLogsLoader,
  playerPlayoffsGameLogsLoader,
} = require('../../loaders/nhl')

const {
  isHot,
  isCold,
  hotColdPoints,
  hotColdGames,
  hotColdPlusMinus,
} = require('../../helpers/nhl/streaks')

const {
  itself,
  resolveProp,
  resolvePath,
  Time,
  PlayerHeight,
  PlayerWeight,
  PlayerStatistic,
} = require('./deconstructors/index')

const POUNDS_TO_KILOGRAMS = 0.453592
const forwardsAbbreviations = ['C', 'LW', 'RW']

const timeStringToTimeType = (timeString = '') => {
  return {
    minutes: Number(timeString.split(':')[0]) || 0,
    seconds: Number(timeString.split(':')[1]) || 0,
  }
}
const PlayerBio = new GraphQLObjectType({
  name: 'PlayerBio',
  fields: {
    firstName: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('firstName'))
    },
    lastName: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('lastName'))
    },
    birthDate: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('birthDate'))
    },
    birthCity: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('birthCity'))
    },
    birthState: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('birthStateProvince'))
    },
    birthCountry: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('birthCountry'))
    },
    shootsCatches: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('shootsCatches'))
    },
    // integers
    height: {
    	type: PlayerHeight,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('height'))
    },
    weight: {
    	type: PlayerWeight,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('weight'))
    },
    age: {
    	type: GraphQLInt,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('currentAge'))
    },
    jerseyNumber: {
    	type: GraphQLInt,
    	resolve: p => playerBioLoader.load(p.id)
        .then(p => Number(p['primaryNumber']))
    },
	}
})

const PlayerStatus = new GraphQLObjectType({
	name: 'PlayerStatus',
	fields: {
    isActive: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('active'))
    },
    isRookie: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('rookie'))
    },
    isVeteran: {
    	type: GraphQLBoolean,
    	resolve: p => playerCareerSeasonStatsLoader.load(p.id)
    		.then(pipe(
	        map(pathOr(0, ['stat', 'games'])),
	        sum,
	        lte(500),
	      ))
    },
    isCaptain: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('captain'))
    },
    isAlternate: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id).then(resolveProp('alternateCaptain'))
    },
    isInjured: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
	      .then(pipe(
	        path(['rosterStatus']),
	        equals('I'),
	      ))
    },
	}
})

const PlayerPosition = new GraphQLObjectType({
  name: 'PlayerPosition',
  fields: {
  	position: {
  		type: GraphQLString,
			resolve: p => playerBioLoader.load(p.id)
				.then(resolvePath(['primaryPosition', 'abbreviation']))
  	},
  	isGoalie: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        equals('G')
	      ))
    },
    isDefenseman: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        equals('D')
	      ))
    },
    isForward: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        abb => forwardsAbbreviations.includes(abb),
	      ))
    },
  }
})

const PlayerStreak = new GraphQLObjectType({
  name: 'PlayerStreak',
  fields: {
    isHot: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        playerSeasonGameLogsLoader.load(p.id),
        playerBioLoader.load(p.id),
      ])
      .then(([gameLogs, info]) => isHot(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    isCold: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        playerSeasonGameLogsLoader.load(p.id),
        playerBioLoader.load(p.id),
      ])
      .then(([gameLogs, info]) => isCold(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    hotColdPoints: {
      type: GraphQLInt,
      resolve: p => playerSeasonGameLogsLoader.load(p.id)
        .then(hotColdPoints)
    },
    hotColdGames: {
      type: GraphQLInt,
      resolve: () => hotColdGames,
    },
    hotColdPlusMinus: {
      type: GraphQLInt,
      resolve: p => playerSeasonGameLogsLoader.load(p.id)
        .then(hotColdPlusMinus)
    },
  }
})

const PlayerDraft = new GraphQLObjectType({
	name: 'PlayerDraft',
	fields: {
    amateurTeam: {
      type: GraphQLString,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('amateurClubName'))
    },
    amateurLeague: {
      type: GraphQLString,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('amateurLeague'))
    },
    draftYear: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('draftYear')),
    },
    pickHistory: {
      type: new GraphQLList(GraphQLString),
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('teamPickHistory')).then(history => history.split(',')),
    },
    round: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('roundNumber')),
    },
    pickInRound: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('pickInRound')),
    },
    overall: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id).then(resolveProp('overallPickNumber')),
    },
	},
});

const PlayerCareer = new GraphQLObjectType({
  name: 'PlayerCareer',
  fields: {
    seasons: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerCareerSeasonStatsLoader.load(p.id)
    },
    playoffs: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerCareerPlayoffsStatsLoader.load(p.id)
    }
  },
})

const PlayerGameLogs = new GraphQLObjectType({
	name: 'PlayerGameLogs',
	fields: {
    season: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerSeasonGameLogsLoader.load(p.id),
    },
    playoff: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerPlayoffsGameLogsLoader.load(p.id),
    },
	},
});

const TeamInfo = new GraphQLObjectType({
	name: 'TeamInfo',
	fields: () => ({
  	id: { type: GraphQLInt, resolve: itself },
	}),
});

module.exports = new GraphQLObjectType({
  name: 'NHLPlayer',
  fields: {
  	id: { type: GraphQLInt, resolve: (p) => p.id },
    bio: { type: PlayerBio, resolve: itself },
    status: { type: PlayerStatus, resolve: itself },
    position: { type: PlayerPosition, resolve: itself },
    streak: { type: PlayerStreak, resolve: itself },
    draft: { type: PlayerDraft, resolve: itself },
    career: { type: PlayerCareer, resolve: itself },
    gameLogs: { type: PlayerGameLogs, resolve: itself },
  },
})