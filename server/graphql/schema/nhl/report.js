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
    playerBirthCountry: { type: GraphQLString, resolve: resolveProp('playerBirthCountry') },
    playerBirthDate: { type: GraphQLString, resolve: resolveProp('playerBirthDate') },
    playerFirstName: { type: GraphQLString, resolve: resolveProp('playerFirstName') },
    playerLastName: { type: GraphQLString, resolve: resolveProp('playerLastName') },
    playerName: { type: GraphQLString, resolve: (doc) => doc.playerName || doc.skaterFullName },
    playerNationality: { type: GraphQLString, resolve: resolveProp('playerNationality') },
    playerPositionCode: { type: GraphQLString, resolve: doc => doc.playerPositionCode || doc.positionCode },
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

    savePctg: { type: GraphQLFloat, resolve: resolveProp('savePctg') },
    goalsAgainstAverage: { type: GraphQLFloat, resolve: resolveProp('goalsAgainstAverage') },
    rookie: { type: GraphQLBoolean, resolve: resolveProp('rookie') },

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
    faceoffWinPctg: { type: GraphQLFloat, resolve: resolveProp('faceoffWinPctg') },
    goalsPerGame: { type: GraphQLFloat, resolve: resolveProp('goalsPerGame') },
    hitsPerGame: { type: GraphQLFloat, resolve: resolveProp('hitsPerGame') },
    shootingPctg: { type: GraphQLFloat, resolve: resolveProp('shootingPctg') },
    shotsPerGame: { type: GraphQLFloat, resolve: resolveProp('shotsPerGame') },
    pointsPerGame: { type: GraphQLFloat, resolve: resolveProp('pointsPerGame') },
    shiftsPerGame: { type: GraphQLFloat, resolve: resolveProp('shiftsPerGame') },
    timeOnIcePerGame: { type: GraphQLFloat, resolve: resolveProp('timeOnIcePerGame') },
  },
})

const Report = new GraphQLObjectType({
	name: 'Report',
	fields: {
		goalies: {
			type: new GraphQLList(Stat),
			resolve: args => playersReportLoader.load(`${args.season}:goalies`),
		},
		skaters: {
			type: new GraphQLList(Stat),
			resolve: args => playersReportLoader.load(`${args.season}:skaters`),
		}
	},
})

module.exports = Report