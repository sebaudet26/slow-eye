const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql')

const {
  resolveProp,
  resolvePath,
} = require('./deconstructors/index')

const { streakLoader } = require('../../loaders/nhl')

const PlayersStreak = new GraphQLObjectType({
  name: 'PlayersStreak',
  fields: {
    id: { type: GraphQLInt, resolve: resolveProp('playerId') },
    name: { type: GraphQLString, resolve: resolveProp('playerName') },
    games: { type: GraphQLInt, resolve: resolvePath(['streak', 'games']) },
    goals: { type: GraphQLInt, resolve: resolvePath(['streak', 'goals']) },
    assists: { type: GraphQLInt, resolve: resolvePath(['streak', 'assists']) },
    shots: { type: GraphQLInt, resolve: resolvePath(['streak', 'shots']) },
    points: { type: GraphQLInt, resolve: resolvePath(['streak', 'points']) },
    shots: { type: GraphQLInt, resolve: resolvePath(['streak', 'shots']) },
    hits: { type: GraphQLInt, resolve: resolvePath(['streak', 'hits']) },
    pim: { type: GraphQLInt, resolve: resolvePath(['streak', 'pim']) },
    plusMinus: { type: GraphQLInt, resolve: resolvePath(['streak', 'plusMinus']) },
  },
})

const TeamsStreak = new GraphQLObjectType({
  name: 'TeamStreak',
  fields: {
    id: { type: GraphQLInt, resolve: resolveProp('id') },
    name: { type: GraphQLString, resolve: resolveProp('name') },
    teamName: { type: GraphQLString, resolve: resolveProp('teamName') },
    abbreviation: { type: GraphQLString, resolve: resolveProp('abbreviation') },
    wins: { type: GraphQLInt, resolve: resolvePath(['streak', 'wins']) },
    losses: { type: GraphQLInt, resolve: resolvePath(['streak', 'losses']) },
    ot: { type: GraphQLInt, resolve: resolvePath(['streak', 'ot']) },
    games: { type: GraphQLInt, resolve: resolvePath(['streak', 'games']) },
    points: { type: GraphQLInt, resolve: resolvePath(['streak', 'points']) },
  },
})

const Streaks = new GraphQLObjectType({
  name: 'Streaks',
  fields: {
		players: {
		  type: new GraphQLList(PlayersStreak),
		  resolve: () => streakLoader.load('players'),
		},
		teams: {
		  type: new GraphQLList(TeamsStreak),
		  resolve: () => streakLoader.load('teams'),
		},
	},
})


module.exports = Streaks

