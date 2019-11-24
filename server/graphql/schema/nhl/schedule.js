const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const {
	resolveProp,
	resolvePath,
} = require('./deconstructors/index')

const {
  gamesScheduleLoader,
} = require('../../loaders/nhl')

const {
  getFinalPeriod,
  getStatusText,
} = require('../../helpers/nhl/games')

const TeamRecord = new GraphQLObjectType({
	name: 'TeamRecord',
	fields: {
		id: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
		name: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
		score: { type: GraphQLInt, resolve: resolveProp('score') },
		wins: { type: GraphQLInt, resolve: resolvePath(['leagueRecord', 'wins']) },
		losses: { type: GraphQLInt, resolve: resolvePath(['leagueRecord', 'losses']) },
		ot: { type: GraphQLInt, resolve: resolvePath(['leagueRecord', 'ot']) },
	}
})

const SeriesSummary = new GraphQLObjectType({
  name: 'SeriesSummary',
  fields: {
    gameLabel: { type: GraphQLString, resolve: resolveProp('gameLabel') },
    necessary: { type: GraphQLBoolean, resolve: resolveProp('necessary') },
    gameCode: { type: GraphQLInt, resolve: resolveProp('gameCode') },
    gameTime: { type: GraphQLString, resolve: resolveProp('gameTime') },
    seriesStatus: { type: GraphQLString, resolve: resolveProp('seriesStatus') },
    seriesStatusShort: { type: GraphQLString, resolve: resolveProp('seriesStatusShort') },
  },
});

const ScheduledGame = new GraphQLObjectType({
	name: 'ScheduledGame',
	fields: {
		id: { type: GraphQLInt, resolve: resolveProp('gamePk') },
		gameType: { type: GraphQLString, resolve: resolveProp('gameType') },
		season: { type: GraphQLString, resolve: resolveProp('season') },
		gameDate: { type: GraphQLString, resolve: resolveProp('gameDate') },
		abstractGameState: { type: GraphQLString, resolve: resolvePath(['status', 'abstractGameState']) },
		codedGameState: { type: GraphQLString, resolve: resolvePath(['status', 'codedGameState']) },
		detailedState: { type: GraphQLString, resolve: resolvePath(['status', 'detailedState']) },
		statusCode: { type: GraphQLString, resolve: resolvePath(['status', 'statusCode']) },
		startTimeTBD: { type: GraphQLBoolean, resolve: resolvePath(['startTimeTBD', 'startTimeTBD']) },
		awayTeam: { type: TeamRecord, resolve: resolvePath(['teams', 'away']) },
		homeTeam: { type: TeamRecord, resolve: resolvePath(['teams', 'home']) },
		seriesSummary: { type: SeriesSummary, resolve: resolveProp('seriesSummary') },
	},
})

module.exports = ScheduledGame