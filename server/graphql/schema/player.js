const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const { 
	equals, 
	lte,
	map,
	path,
	pathOr,
	pipe,
	prop,
	sum,
	take,
} = require('ramda')

const { 
	playerBioLoader,
	playerCareerSeasonStatsLoader,
	playerSeasonGameLogsLoader,
} = require('../loaders/nhl')

const {
  isHot,
  isCold,
  hotColdPoints,
  hotColdGames,
  hotColdPlusMinus,
} = require('../streaks');

const forwardsAbbreviations = ['C', 'LW', 'RW']

const resolveProp = propName => obj => Promise.resolve(obj[propName])
const resolvePath = objPath => obj => Promise.resolve(path(objPath, obj))

const itself = (p = {}) => p

const PlayerHeight = new GraphQLObjectType({
  name: 'PlayerHeight',
  fields: {
  	feet: { type: GraphQLInt, resolve: height => height.split('\' ')[0] },
  	inches: { type: GraphQLInt, resolve: height => height.split('\' ')[0].replace('\"', '') },
  },
})
const PlayerWeight = new GraphQLObjectType({
  name: 'PlayerWeight',
  fields: {
  	pounds: { type: GraphQLInt, resolve: weight =>  weight },
  	kilograms: { type: GraphQLInt, resolve: weight => Math.round(weight * 0.453592) },
  },
})

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
    	resolve: p => playerBioLoader.load(p.id).then(p => Number(p['primaryNumber']))
    },
	}
})

const PlayerStatus = new GraphQLObjectType({
	name: 'PlayerStatus',
	fields: {
		// booleans
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
	        forwardsAbbreviations.includes,
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
      resolve: p => playerSeasonGameLogsLoader.load(p.id).then(hotColdPoints)
    },
    hotColdGames: {
      type: GraphQLInt,
      resolve: () => hotColdGames,
    },
    hotColdPlusMinus: {
      type: GraphQLInt,
      resolve: p => playerSeasonGameLogsLoader.load(p.id).then(hotColdPlusMinus)
    },
  }
})

//     // Lazy load team info
//     team: {
//       type: TeamInfo,
//       resolve: p => p.team || fetchInfoForTeamId(p.teamId),
//     },


const PlayerDraft = new GraphQLObjectType({
	name: 'PlayerDraft',
	fields: {
//     year: { type: GraphQLInt, resolve: prop('draftYear') },
//     round: { type: GraphQLInt, resolve: prop('roundNumber') },
//     pickOverall: { type: GraphQLInt, resolve: prop('overallPickNumber') },
//     pickInRound: { type: GraphQLInt, resolve: prop('pickInRound') },
//     team: { type: TeamInfo, resolve: p => fetchInfoForTeamId(p.draftedByTeamId) },
	},
});

const PlayerCareer = new GraphQLObjectType({
	name: 'PlayerCareer',
	fields: {

	},
});

const PlayerGameLogs = new GraphQLObjectType({
	name: 'PlayerGameLogs',
	fields: {

	},
});

const PlayerStats = new GraphQLObjectType({
	name: 'PlayerStats',
	fields: {

	},
});

// Another file
const TeamInfo = new GraphQLObjectType({
	name: 'TeamInfo',
	fields: () => ({
  	id: { type: GraphQLInt, resolve: (p) => p },
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
    team: { 
    	type: TeamInfo, 
    	resolve: p => playerBioLoader.load(p.id)
    		.then(resolvePath(['currentTeam', 'id']))
    }
  },
})