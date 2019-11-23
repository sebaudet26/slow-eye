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
	PlayerWeight,
	PlayerHeight,
} = require('./deconstructors')

const resolveProp = propName => obj => Promise.resolve(obj[propName])
const resolvePath = objPath => obj => Promise.resolve(path(objPath, obj))

const itself = (p = {}) => p

const {
	teamsLoader,
  teamRosterLoader,
	teamInfoLoader,
	teamStatsLoader,
} = require('../loaders/nhl')

const Player = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: { type: GraphQLInt, resolve: resolveProp('id') },
    name: { type: GraphQLString, resolve: resolveProp('fullName') },
    jerseyNumber: { type: GraphQLString, resolve: resolveProp('jerseyNumber') },
    position: { type: GraphQLString, resolve: resolvePath(['position', 'code']) },
  },
})


const Team = new GraphQLObjectType({
  name: 'Team',
  fields: {
  	id: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('id')) },
    name: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('name')) },
    abbreviation: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('abbreviation')) },
    teamName: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('teamName')) },
    locationName: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('locationName')) },
    shortName: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('shortName')) },
    active: { type: GraphQLString, resolve: (team) => teamInfoLoader.load(team.id).then(resolveProp('active')) },
    gamesPlayed: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'gamesPlayed'])) },
    wins: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'wins'])) },
    losses: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'losses'])) },
    ot: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'ot'])) },
    pts: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'pts'])) },
    powerPlayGoals: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'powerPlayGoals'])) },
    powerPlayGoalsAgainst: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'powerPlayGoalsAgainst'])) },
    faceOffsTaken: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'faceOffsTaken'])) },
    faceOffsWon: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'faceOffsWon'])) },
    faceOffsLost: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'faceOffsLost'])) },
    powerPlayOpportunities: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'powerPlayOpportunities'])) },
    goalsPerGame: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'goalsPerGame'])) },
    goalsAgainstPerGame: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'goalsAgainstPerGame'])) },
    evGGARatio: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'evGGARatio'])) },
    shotsPerGame: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'shotsPerGame'])) },
    shotsAllowed: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'shotsAllowed'])) },
    winScoreFirst: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winScoreFirst'])) },
    winOppScoreFirst: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winOppScoreFirst'])) },
    winLeadFirstPer: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winLeadFirstPer'])) },
    winLeadSecondPer: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winLeadSecondPer'])) },
    winOutshootOpp: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winOutshootOpp'])) },
    winOutshotByOpp: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'winOutshotByOpp'])) },
    shootingPctg: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'shootingPctg'])) },
    savePctg: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'savePctg'])) },

    ptPctg: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'ptPctg'])).then((value) => Number(value)) },
    powerPlayPercentage: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'powerPlayPercentage'])).then((value) => Number(value)) },
    penaltyKillPercentage: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'penaltyKillPercentage'])).then((value) => Number(value)) },
    faceOffWinPercentage: { type: GraphQLFloat, resolve: doc => teamStatsLoader.load(`${doc.season}:${doc.id}`).then(resolvePath(['stats', 'faceOffWinPercentage'])).then((value) => Number(value)) },

    roster: { type: new GraphQLList(Player), resolve: doc => teamRosterLoader.load(`${doc.season}:${doc.id}`) },
  }
})

module.exports = Team
