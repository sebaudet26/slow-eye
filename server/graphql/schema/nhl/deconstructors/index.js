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

const resolveProp = propName => obj => Promise.resolve(obj[propName])
const resolveOneOf = props => obj => {
  let value
  props.forEach((prop) => {
    if (obj[prop]) {
      value = obj[prop]
    }
  })
  Promise.resolve(value)
}

const resolvePath = objPath => obj => Promise.resolve(path(objPath, obj))

const toNumber = (rank) => Number(rank)

const itself = (p = {}) => p

const POUNDS_TO_KILOGRAMS = 0.453592
const forwardsAbbreviations = ['C', 'LW', 'RW']

const timeStringToTimeType = (timeString = '') => {
  return {
    minutes: Number(timeString.split(':')[0]) || 0,
    seconds: Number(timeString.split(':')[1]) || 0,
  }
}

const Time = new GraphQLObjectType({
  name: 'Time',
  fields: {
    minutes: { type: GraphQLInt, resolve: time => time.minutes },
    seconds: { type: GraphQLInt, resolve: time => time.seconds },
  },
})

const PlayerHeight = new GraphQLObjectType({
  name: 'PlayerHeight',
  fields: {
  	feet: { type: GraphQLInt, resolve: height => height.split('\' ')[0] },
  	inches: { type: GraphQLInt, resolve: height => height.split('\' ')[1].replace('\"', '') },
  },
})

const PlayerWeight = new GraphQLObjectType({
  name: 'PlayerWeight',
  fields: {
  	pounds: { type: GraphQLInt, resolve: weight =>  weight },
  	kilograms: { type: GraphQLInt, resolve: weight => Math.round(weight * POUNDS_TO_KILOGRAMS) },
  },
})


const GoalieStats = new GraphQLObjectType({
  name: 'GoalieStats',
  fields: {
    ot: { type: GraphQLInt, resolve: resolvePath(['stat', 'ot']) },
    shutouts: { type: GraphQLInt, resolve: resolvePath(['stat', 'shutouts']) },
    ties: { type: GraphQLInt, resolve: resolvePath(['stat', 'ties']) },
    wins: { type: GraphQLInt, resolve: resolvePath(['stat', 'wins']) },
    losses: { type: GraphQLInt, resolve: resolvePath(['stat', 'losses']) },
    saves: { type: GraphQLInt, resolve: resolvePath(['stat', 'saves']) },
    powerPlaySaves: { type: GraphQLInt, resolve: resolvePath(['stat', 'powerPlaySaves']) },
    shortHandedSaves: { type: GraphQLInt, resolve: resolvePath(['stat', 'shortHandedSaves']) },
    evenSaves: { type: GraphQLInt, resolve: resolvePath(['stat', 'evenSaves']) },
    shortHandedShots: { type: GraphQLInt, resolve: resolvePath(['stat', 'shortHandedShots']) },
    evenShots: { type: GraphQLInt, resolve: resolvePath(['stat', 'evenShots']) },
    powerPlayShots: { type: GraphQLInt, resolve: resolvePath(['stat', 'powerPlayShots']) },
    savePercentage: { type: GraphQLFloat, resolve: resolvePath(['stat', 'savePercentage']) },
    goalAgainstAverage: { type: GraphQLFloat, resolve: resolvePath(['stat', 'goalAgainstAverage']) },
    gamesStarted: { type: GraphQLInt, resolve: resolvePath(['stat', 'gamesStarted']) },
    shotsAgainst: { type: GraphQLInt, resolve: resolvePath(['stat', 'shotsAgainst']) },
    goalsAgainst: { type: GraphQLInt, resolve: resolvePath(['stat', 'goalsAgainst']) },
    powerPlaySavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stat', 'powerPlaySavePercentage']) },
    shortHandedSavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stat', 'shortHandedSavePercentage']) },
    evenStrengthSavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stat', 'evenStrengthSavePercentage']) },
  },
})

const UsageStats = new GraphQLObjectType({
  name: 'TimeStats',
  fields: {
    shifts: { type: GraphQLInt, resolve: resolvePath(['stat', 'shifts']) },
    timeOnIce: { type: Time, resolve: p => resolvePath(['stat', 'timeOnIce'])(p).then(timeStringToTimeType) },
    powerPlayTimeOnIce: { type: Time, resolve: p => resolvePath(['stat', 'powerPlayTimeOnIce'])(p).then(timeStringToTimeType) },
    evenTimeOnIce: { type: Time, resolve: p => resolvePath(['stat', 'evenTimeOnIce'])(p).then(timeStringToTimeType) },
    shortHandedTimeOnIce: { type: Time, resolve: p => resolvePath(['stat', 'shortHandedTimeOnIce'])(p).then(timeStringToTimeType) },
  }
})

const FaceoffStats = new GraphQLObjectType({
  name: 'FaceoffStats',
  fields: {
    faceOffPct: { type: GraphQLFloat, resolve: resolvePath(['stat', 'faceOffPct']) },
    faceOffWins: { type: GraphQLInt, resolve: resolvePath(['stat', 'faceOffWins']) },
    faceOffTaken: { type: GraphQLInt, resolve: resolvePath(['stat', 'faceoffTaken']) },
  },
})

const OffensiveStats = new GraphQLObjectType({
  name: 'OffensiveStats',
  fields: {
    assists: { type: GraphQLInt, resolve: resolvePath(['stat', 'assists']) },
    goals: { type: GraphQLInt, resolve: resolvePath(['stat', 'goals']) },
    points: { type: GraphQLInt, resolve: resolvePath(['stat', 'points']) },
    powerPlayGoals: { type: GraphQLInt, resolve: resolvePath(['stat', 'powerPlayGoals']) },
    powerPlayPoints: { type: GraphQLInt, resolve: resolvePath(['stat', 'powerPlayPoints']) },
    gameWinningGoals: { type: GraphQLInt, resolve: resolvePath(['stat', 'gameWinningGoals']) },
    overTimeGoals: { type: GraphQLInt, resolve: resolvePath(['stat', 'overTimeGoals']) },
    shortHandedGoals: { type: GraphQLInt, resolve: resolvePath(['stat', 'shortHandedGoals']) },
    shortHandedPoints: { type: GraphQLInt, resolve: resolvePath(['stat', 'shortHandedPoints']) },
    shotPct: { type: GraphQLFloat, resolve: resolvePath(['stat', 'shotPct']) },
    shots: { type: GraphQLInt, resolve: resolvePath(['stat', 'shots']) },
  },
})

const DefensiveStats = new GraphQLObjectType({
  name: 'DefensiveStats',
  fields: {
    pim: { type: GraphQLInt, resolve: resolvePath(['stat', 'pim']) },
    hits: { type: GraphQLInt, resolve: resolvePath(['stat', 'hits']) },
    plusMinus: { type: GraphQLInt, resolve: resolvePath(['stat', 'plusMinus']) },
    blocked: { type: GraphQLInt, resolve: resolvePath(['stat', 'blocked']) },
    penaltyMinutes: { type: GraphQLFloat, resolve: p => resolvePath(['stat', 'penaltyMinutes'])(p).then((minutes) => Number(minutes)) },
    takeaways: { type: GraphQLInt, resolve: resolvePath(['stat', 'takeaways']) },
    giveaways: { type: GraphQLInt, resolve: resolvePath(['stat', 'giveaways']) },
  }
})

const GameLogAdditionalInfo = new GraphQLObjectType({
  name: 'GameLogAdditionalInfo',
  fields: {
    date: { type: GraphQLString, resolve: resolvePath(['date']) },
    isHome: { type: GraphQLBoolean, resolve: resolvePath(['isHome']) },
    isWin: { type: GraphQLBoolean, resolve: resolvePath(['isWin']) },
    isOT: { type: GraphQLBoolean, resolve: resolvePath(['isOT']) },
    opponentTeamId: { type: GraphQLInt, resolve: resolvePath(['opponent', 'id']) },
    gameId: { type: GraphQLInt, resolve: resolvePath(['game', 'gamePk']) },
  }
})

const PlayerStatistic = new GraphQLObjectType({
  name: 'PlayerStatistic',
  fields: {
    season: { type: GraphQLString, resolve: resolvePath(['season']) },
    teamId: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
    teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
    leagueName: { type: GraphQLString, resolve: resolvePath(['league', 'name']) },
    games: { type: GraphQLInt, resolve: resolvePath(['stat', 'games']) },

    offensive: { type: OffensiveStats, resolve: itself },

    defensive: { type: DefensiveStats, resolve: itself },

    faceoffStats: { type: FaceoffStats, resolve: itself },

    usageStats: { type: UsageStats, resolve: itself },

    goalieStats: { type: GoalieStats, resolve: itself },

    gameInfo: { type: GameLogAdditionalInfo, resolve: itself },
  },
});

const TeamName = new GraphQLObjectType({
  name: 'TeamName',
  fields: {
    id: { type: GraphQLInt, resolve: doc => doc.id },
    name: { type: GraphQLString, resolve: doc => doc.name },
    abbreviation: { type: GraphQLString, resolve: doc => doc.abbreviation },
  }
})

const PlayerName = new GraphQLObjectType({
  name: 'PlayerName',
  fields: {
    id: { type: GraphQLInt, resolve: doc => doc.playerId },
    name: { type: GraphQLString, resolve: doc => doc.playerName },
    birthDate: { type: GraphQLString, resolve: doc => doc.playerBirthDate },
    nationality: { type: GraphQLString, resolve: doc => doc.playerNationality },
    position: { type: GraphQLString, resolve: doc => doc.playerPositionCode },
  }
})

module.exports = {
	providedArgs: (_, args) => args || {},
	resolveProp,
	resolvePath,
  resolveOneOf,
	toNumber,
	itself,
	timeStringToTimeType,

	Time,
	TeamName,

	PlayerName,
	PlayerWeight,
	PlayerHeight,
  PlayerStatistic,

	GoalieStats,
	UsageStats,
	FaceoffStats,
	OffensiveStats,
	DefensiveStats,
	GameLogAdditionalInfo,
}