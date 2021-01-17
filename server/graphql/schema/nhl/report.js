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
  resolveOneOf,
  PlayerWeight,
  PlayerHeight,
} = require('./deconstructors')

const {
  playersReportLoader,
} = require('../../loaders/nhl')


const Stat = new GraphQLObjectType({
  name: 'Stat',
  fields: {
    playerBirthDate: { type: GraphQLString, resolve: resolveProp('birthDate') },
    playerName: { type: GraphQLString, resolve: (doc) => doc.goalieFullName || doc.skaterFullName },
    playerNationality: { type: GraphQLString, resolve: resolveProp('nationalityCode') },
    playerPositionCode: { type: GraphQLString, resolve: doc => doc.playerPositionCode || doc.positionCode || 'G' },
    playerShootsCatches: { type: GraphQLString, resolve: doc => doc.playerShootsCatches || doc.shootsCatches },
    playerTeamsPlayedFor: {
    	type: new GraphQLList(GraphQLString),
    	resolve: doc => Promise.resolve(doc.teamAbbrevs || doc.playerTeamsPlayedFor).then((str = '') => str.split(','))
    },

    gamesPlayed: { type: GraphQLInt, resolve: resolveProp('gamesPlayed') },
    gamesStarted: { type: GraphQLInt, resolve: resolveProp('gamesStarted') },
    goalsAgainst: { type: GraphQLInt, resolve: resolveProp('goalsAgainst') },
    losses: { type: GraphQLInt, resolve: resolveProp('losses') },
    otLosses: { type: GraphQLInt, resolve: resolveProp('otLosses') },
    playerHeight: { type: GraphQLInt, resolve: resolveProp('playerHeight') },
    playerId: { type: GraphQLInt, resolve: resolveProp('playerId') },
    playerInHockeyHof: { type: GraphQLInt, resolve: resolveProp('playerInHockeyHof') },
    playerIsActive: { type: GraphQLInt, resolve: resolveProp('playerIsActive') },
    playerWeight: { type: GraphQLInt, resolve: resolveProp('playerWeight') },

    saves: { type: GraphQLInt, resolve: resolveProp('saves') },
    seasonId: { type: GraphQLInt, resolve: resolveProp('seasonId') },
    shotsAgainst: { type: GraphQLInt, resolve: resolveProp('shotsAgainst') },
    shutouts: { type: GraphQLInt, resolve: resolveProp('shutouts') },
    ties: { type: GraphQLInt, resolve: resolveProp('ties') },
    timeOnIce: { type: GraphQLInt, resolve: resolveProp('timeOnIce') },
    wins: { type: GraphQLInt, resolve: resolveProp('wins') },

    savePercentage: { type: GraphQLFloat, resolve: resolveProp('savePct') },
    goalsAgainstAverage: { type: GraphQLFloat, resolve: resolveProp('goalsAgainstAverage') },

    blockedShots: { type: GraphQLInt, resolve: resolveProp('blockedShots') },
    faceoffs: { type: GraphQLInt, resolve: resolveProp('faceoffs') },
    faceoffsLost: { type: GraphQLInt, resolve: resolveProp('faceoffsLost') },
    faceoffsWon: { type: GraphQLInt, resolve: resolveProp('faceoffsWon') },
    giveaways: { type: GraphQLInt, resolve: resolveProp('giveaways') },
    goals: { type: GraphQLInt, resolve: resolveProp('goals') },
    hits: { type: GraphQLInt, resolve: resolveProp('hits') },
    missedShots: { type: GraphQLInt, resolve: resolveProp('missedShots') },
    shots: { type: GraphQLInt, resolve: resolveProp('shots') },
    takeaways: { type: GraphQLInt, resolve: resolveProp('takeaways') },
    assists: { type: GraphQLInt, resolve: resolveProp('assists') },
    gameWinningGoals: { type: GraphQLInt, resolve: resolveProp('gameWinningGoals') },
    otGoals: { type: GraphQLInt, resolve: resolveProp('otGoals') },
    penaltyMinutes: { type: GraphQLInt, resolve: resolveProp('penaltyMinutes') },
    plusMinus: { type: GraphQLInt, resolve: resolveProp('plusMinus') },
    points: { type: GraphQLInt, resolve: resolveProp('points') },
    ppGoals: { type: GraphQLInt, resolve: resolveProp('ppGoals') },
    ppPoints: { type: GraphQLInt, resolve: resolveProp('ppPoints') },
    shGoals: { type: GraphQLInt, resolve: resolveProp('shGoals') },
    shPoints: { type: GraphQLInt, resolve: resolveProp('shPoints') },

    missedShotsPerGame: { type: GraphQLFloat, resolve: resolveProp('missedShotsPerGame') },
    blockedShotsPerGame: { type: GraphQLFloat, resolve: resolveProp('blockedShotsPerGame') },
    faceoffWinPctg: { type: GraphQLFloat, resolve: resolveProp('faceoffWinPct') },
    goalsPerGame: { type: GraphQLFloat, resolve: resolveProp('goalsPerGame') },
    hitsPerGame: { type: GraphQLFloat, resolve: resolveProp('hitsPerGame') },
    shootingPctg: { type: GraphQLFloat, resolve: doc => {
        return ((doc.shootingPct || 0) * 100).toFixed(0) 
    }},
    shotsPerGame: { type: GraphQLFloat, resolve: resolveProp('shotsPerGame') },
    pointsPerGame: { type: GraphQLFloat, resolve: resolveProp('pointsPerGame') },
    shiftsPerGame: { type: GraphQLFloat, resolve: resolveProp('shiftsPerGame') },
    timeOnIcePerGame: { type: GraphQLFloat, resolve: doc => {
        return ((doc.timeOnIcePerGame || 0) / 60).toFixed(0)
    }},
  },
})

const Report = new GraphQLObjectType({
	name: 'Report',
	fields: {
		players: {
			type: new GraphQLList(Stat),
			resolve: args => playersReportLoader.load(args.season || '20202021'),
		}
	},
})

module.exports = Report