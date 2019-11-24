const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const {
  gameBoxscoreLoader,
	gameLivefeedLoader,
	gameHighlightsLoader,
} = require('../../loaders/nhl')

const {
	toNumber,
	resolvePath,
	resolveProp,
} = require('./deconstructors/index')

const Highlight = new GraphQLObjectType({
	name: 'Highlight',
	fields: {
		statsEventId: { type: GraphQLString, resolve: resolveProp('statsEventId') },
    periodTime: { type: GraphQLString, resolve: resolveProp('periodTime') },
    period: { type: GraphQLString, resolve: resolveProp('period') },
    url: { type: GraphQLString, resolve: resolveProp('url') },
	},
})

const GameTeamStats = new GraphQLObjectType({
	name: 'GameTeamStats',
	fields: {
		goals: { type: GraphQLInt, resolve: resolveProp('goals') },
	  pim: { type: GraphQLInt, resolve: resolveProp('pim') },
	  shots: { type: GraphQLInt, resolve: resolveProp('shots') },
	  powerPlayGoals: { type: GraphQLInt, resolve: resolveProp('powerPlayGoals') },
	  powerPlayOpportunities: { type: GraphQLInt, resolve: resolveProp('powerPlayOpportunities') },
	  blocked: { type: GraphQLInt, resolve: resolveProp('blocked') },
	  takeaways: { type: GraphQLInt, resolve: resolveProp('takeaways') },
	  giveaways: { type: GraphQLInt, resolve: resolveProp('giveaways') },
	  hits: { type: GraphQLInt, resolve: resolveProp('hits') },
	  faceOffWinPercentage: {
	  	type: GraphQLFloat,
	  	resolve: doc => resolveProp('faceOffWinPercentage')(doc).then(toNumber)
	  },
	  powerPlayPercentage: {
	  	type: GraphQLFloat,
	  	resolve: doc => resolveProp('powerPlayPercentage')(doc).then(toNumber)
	  },
	}
})

const GamePlayer = new GraphQLObjectType({
	name: 'BoxscorePlayerName',
	fields: {
		id: { type: GraphQLInt, resolve: resolvePath(['person', 'id']) },
		name: { type: GraphQLString, resolve: resolvePath(['person', 'fullName']) },
		jerseyNumber: { type: GraphQLInt, resolve: resolveProp('jerseyNumber') },
		position: { type: GraphQLString, resolve: resolvePath(['position', 'code']) },
		assists: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'assists']) },
	  goals: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'goals']) },
	  shots: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'shots']) },
	  hits: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'hits']) },
	  powerPlayGoals: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'powerPlayGoals']) },
	  powerPlayAssists: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'powerPlayAssists']) },
	  penaltyMinutes: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'penaltyMinutes']) },
	  faceOffWins: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'faceOffWins']) },
	  faceoffTaken: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'faceoffTaken']) },
	  takeaways: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'takeaways']) },
	  giveaways: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'giveaways']) },
	  shortHandedGoals: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedGoals']) },
	  shortHandedAssists: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedAssists']) },
	  blocked: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'blocked']) },
	  plusMinus: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'plusMinus']) },
	  faceOffPct: { type: GraphQLFloat, resolve: resolvePath(['stats', 'skaterStats', 'faceOffPct']) },
		timeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'timeOnIce']) },
	  evenTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'evenTimeOnIce']) },
	  powerPlayTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'powerPlayTimeOnIce']) },
	  shortHandedTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedTimeOnIce']) },
	}
})

const GameTeam = new GraphQLObjectType({
	name: 'GameTeam',
	fields: {
		teamId: { type:GraphQLInt, resolve: resolvePath(['team', 'id']) },
		teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
    coach: { type: GraphQLString, resolve: resolvePath(['coaches', 0, 'person', 'fullName']) },
    teamStats: { type: GameTeamStats, resolve: resolvePath(['teamStats', 'teamSkaterStats']) },
    playerStats: {
    	type: new GraphQLList(GamePlayer),
    	resolve: (doc) => Object.values(doc.players || {}),
    },
	}
})

const Game = new GraphQLObjectType({
	name: 'Game',
	fields: {
		recap: {
			type: GraphQLString,
			resolve: doc => gameHighlightsLoader.load(doc.id).then(resolveProp('recap'))
		},
		goalsHighlights: {
			type: new GraphQLList(Highlight),
			resolve: doc => gameHighlightsLoader.load(doc.id).then(resolveProp('goalsHighlights'))
		},
		awayTeam: {
			type: GameTeam,
			resolve: doc => gameBoxscoreLoader.load(doc.id).then(resolveProp('away')),
		},
		homeTeam: {
			type: GameTeam,
			resolve: doc => gameBoxscoreLoader.load(doc.id).then(resolveProp('home')),
		}
	},
})

module.exports = Game