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
  gameHighlightsLoader,
  gameLivefeedLoader,
} = require('../../loaders/nhl')

const {
  getFinalPeriod,
  getStatusText,
  getDateString,
  isScheduled,
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
    recap: { 
      type: GraphQLString, 
      resolve: doc => gameHighlightsLoader
        .load(doc.gamePk)
        .then(resolveProp('recap'))
    },
    statusText: { 
      type: GraphQLString, 
      resolve: doc => gameLivefeedLoader
        .load(doc.gamePk)
        .then(liveFeed => getStatusText(doc, liveFeed)) 
    },

    currentPeriod: { type: GraphQLString, resolve: resolvePath(['linescore','currentPeriodOrdinal']) },
    currentPeriodTime: { type: GraphQLString, resolve: resolvePath(['linescore','currentPeriodTimeRemaining']) },
    seriesSummary: { 
      type: GraphQLString, 
      resolve: doc => {
        if (doc.gameType == 'P') {
          return doc.seriesSummary.seriesStatusShort || 'series not started'
        }
        return ''
      }
    },

    dateString: { type: GraphQLString, resolve: getDateString },
    isScheduled: { type: GraphQLBoolean, resolve: isScheduled },
		type: { type: GraphQLString, resolve: resolveProp('gameType') },
		season: { type: GraphQLString, resolve: resolveProp('season') },
		dateTime: { type: GraphQLString, resolve: resolveProp('gameDate') },
		abstractGameState: { type: GraphQLString, resolve: resolvePath(['status', 'abstractGameState']) },
		codedGameState: { type: GraphQLString, resolve: resolvePath(['status', 'codedGameState']) },
		detailedState: { type: GraphQLString, resolve: resolvePath(['status', 'detailedState']) },
		statusCode: { type: GraphQLString, resolve: resolvePath(['status', 'statusCode']) },
		startTimeTBD: { type: GraphQLBoolean, resolve: resolvePath(['startTimeTBD']) },
		awayTeam: { type: TeamRecord, resolve: resolvePath(['teams', 'away']) },
		homeTeam: { type: TeamRecord, resolve: resolvePath(['teams', 'home']) },
	},
})

module.exports = ScheduledGame