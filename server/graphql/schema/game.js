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
  gameBoxscoreLoader,
	gameLivefeedLoader,
	gameHighlightsLoader,
} = require('../loaders/nhl')

const resolveProp = propName => obj => Promise.resolve(obj[propName])
const resolvePath = objPath => obj => Promise.resolve(path(objPath, obj))

const itself = (p = {}) => p

const Highlight = new GraphQLObjectType({
	name: 'Highlight',
	fields: {
		statsEventId: { type: GraphQLString, resolve: resolveProp('statsEventId') },
    periodTime: { type: GraphQLString, resolve: resolveProp('periodTime') },
    period: { type: GraphQLString, resolve: resolveProp('period') },
    url: { type: GraphQLString, resolve: resolveProp('url') },
	},
})

const BoxscoreTeamStats = new GraphQLObjectType({
	name: 'BoxscoreTeamStats',
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
	  	resolve: doc => resolveProp('faceOffWinPercentage')(doc).then((str) => Number(str))
	  },
	  powerPlayPercentage: {
	  	type: GraphQLFloat,
	  	resolve: doc => resolveProp('powerPlayPercentage')(doc).then((str) => Number(str))
	  },
	}
})

const GamePlayer = new GraphQLObjectType({
	name: 'BoxscorePlayerName',
	fields: {
		id: { type: GraphQLInt, resolve: resolvePath(['person', 'id']) },
		name: { type: GraphQLInt, resolve: resolvePath(['person', 'id']) },
		jerseyNumber: { type: GraphQLInt, resolve: resolveProp('jerseyNumber') },
		position: { type: GraphQLInt, resolve: resolvePath(['position', 'code']) },
	}
})

const GameTeam = new GraphQLObjectType({
	name: 'GameTeam',
	fields: {
		teamId: { type:GraphQLInt, resolve: resolvePath(['team', 'id']) },
		teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
    teamStats: { type: BoxscoreTeamStats, resolve: resolvePath(['teamStats', 'teamSkaterStats']) },
    coach: { type: GraphQLString, resolve: resolvePath(['coaches', 0, 'person', 'fullName']) },

    // players: {
    //   ID8477493: [Object]
    // },
    // goalies: [ 8478470 ],
    // skaters: [
    //   8477963, 8475796, 8478569
    // ],
    // scratches: [ 8477963, 8475796, 8478569 ],
	}
})

const Game = new GraphQLObjectType({
	name: 'Game',
	fields: {
		recap: { type: GraphQLString, resolve: doc => gameHighlightsLoader.load(doc.id).then(resolveProp('recap')) },
		goalsHighlights: { type: new GraphQLList(Highlight), resolve: doc => gameHighlightsLoader.load(doc.id).then(resolveProp('goalsHighlights')) },
		awayTeam: { type: GameTeam, resolve: doc => gameBoxscoreLoader.load(doc.id).then((stuff) => {
			console.log(stuff.away.players)
			return stuff.away
		})}
	},
})

module.exports = Game