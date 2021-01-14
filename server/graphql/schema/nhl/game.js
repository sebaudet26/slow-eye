const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql')

const { filter, last, pathOr } = require('ramda')

const {
  getStatusText,
} = require('../../helpers/nhl/games')

const {
  gameBoxscoreLoader,
	gameLivefeedLoader,
	gameHighlightsLoader,
	teamStatsLoader,
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
	  penaltyMinutes: { type: GraphQLInt, resolve: d => {
			return pathOr(null, ['stats', 'skaterStats', 'penaltyMinutes'], d) || pathOr(null, ['stats', 'goalieStats', 'pim'], d) 
		}},
	  faceOffWins: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'faceOffWins']) },
	  faceOffTaken: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'faceOffTaken']) },
	  takeaways: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'takeaways']) },
	  giveaways: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'giveaways']) },
	  shortHandedGoals: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedGoals']) },
	  shortHandedAssists: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedAssists']) },
	  blocked: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'blocked']) },
	  plusMinus: { type: GraphQLInt, resolve: resolvePath(['stats', 'skaterStats', 'plusMinus']) },
	  faceOffPct: { type: GraphQLFloat, resolve: resolvePath(['stats', 'skaterStats', 'faceOffPct']) },
		timeOnIce: { type: GraphQLString, resolve: d => {
			return pathOr(null, ['stats', 'skaterStats', 'timeOnIce'], d) || pathOr(null, ['stats', 'goalieStats', 'timeOnIce'], d) 
		}},
	  evenTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'evenTimeOnIce']) },
	  powerPlayTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'powerPlayTimeOnIce']) },
	  shortHandedTimeOnIce: { type: GraphQLString, resolve: resolvePath(['stats', 'skaterStats', 'shortHandedTimeOnIce']) },
	  shotsReceived: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'shots']) },
		saves: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'saves']) },
		powerPlaySaves: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'powerPlaySaves']) },
		shortHandedSaves: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'shortHandedSaves']) },
		evenSaves: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'evenSaves']) },
		shortHandedShotsAgainst: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'shortHandedShotsAgainst']) },
		evenShotsAgainst: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'evenShotsAgainst']) },
		powerPlayShotsAgainst: { type: GraphQLInt, resolve: resolvePath(['stats', 'goalieStats', 'powerPlayShotsAgainst']) },
		savePercentage: { type: GraphQLFloat, resolve: resolvePath(['stats', 'goalieStats', 'savePercentage']) },
		powerPlaySavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stats', 'goalieStats', 'powerPlaySavePercentage']) },
		shortHandedSavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stats', 'goalieStats', 'shortHandedSavePercentage']) },
		evenStrengthSavePercentage: { type: GraphQLFloat, resolve: resolvePath(['stats', 'goalieStats', 'evenStrengthSavePercentage']) },
		decision: { type: GraphQLString, resolve: resolvePath(['stats', 'goalieStats', 'decision']) },
	}
})

const GameTeam = new GraphQLObjectType({
	name: 'GameTeam',
	fields: {
		teamId: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
		teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
    coach: { type: GraphQLString, resolve: resolvePath(['coaches', 0, 'person', 'fullName']) },
    teamStats: { type: GameTeamStats, resolve: resolvePath(['teamStats', 'teamSkaterStats']) },
    playerStats: {
    	type: new GraphQLList(GamePlayer),
    	resolve: (doc) => Object.values(doc.players || {}),
    },
    // TODO: hardcoded current season
    wins: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`20202021:${doc.team.id}`).then(resolvePath(['stats', 'wins'])) },
    losses: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`20202021:${doc.team.id}`).then(resolvePath(['stats', 'losses'])) },
    ot: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`20202021:${doc.team.id}`).then(resolvePath(['stats', 'ot'])) },
    pts: { type: GraphQLInt, resolve: doc => teamStatsLoader.load(`20202021:${doc.team.id}`).then(resolvePath(['stats', 'pts'])) },
	},
})

const GameGoalPlayer = new GraphQLObjectType({
	name: 'GameGoalPlayer',
	fields: {
		id: { type: GraphQLInt, resolve: resolvePath(['player', 'id']) },
		seasonTotal: { type: GraphQLInt, resolve: resolvePath(['seasonTotal']) },
		name: { type: GraphQLString, resolve: resolvePath(['player', 'fullName']) },
	},
})

const GamePenatly = new GraphQLObjectType({
	name: 'GamePenatly',
	fields: {
		teamId: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
		teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
		description: { type: GraphQLString, resolve: resolvePath(['result', 'description']) },
		minutes: { type: GraphQLInt, resolve: resolvePath(['result', 'penaltyMinutes']) },
		periodNumber: { type: GraphQLInt, resolve: resolvePath(['about', 'period']) },
		periodTime: { type: GraphQLString, resolve: resolvePath(['about', 'periodTime']) },
		type: { type: GraphQLString, resolve: resolvePath(['result', 'secondaryType']) },
		player: { type: GameGoalPlayer, resolve: doc => pathOr({}, ['players', 0], doc) },
	},
})

const GameGoal = new GraphQLObjectType({
	name: 'GameGoal',
	fields: {
		teamId: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
		teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
		description: { type: GraphQLString, resolve: resolvePath(['result', 'description']) },
		isGameWinningGoal: { type: GraphQLString, resolve: resolvePath(['result', 'gameWinningGoal']) },
		emptyNet: { type: GraphQLString, resolve: resolvePath(['result', 'emptyNet']) },
		strength: { type: GraphQLString, resolve: resolvePath(['result', 'strength', 'code']) },
		periodNumber: { type: GraphQLInt, resolve: resolvePath(['about', 'period']) },
		periodTime: { type: GraphQLString, resolve: resolvePath(['about', 'periodTime']) },
		periodDescription: { type: GraphQLString, resolve: resolvePath(['about', 'ordinalNum']) },
		scoreAway: { type: GraphQLString, resolve: resolvePath(['about', 'goals', 'away']) },
		scoreHome: { type: GraphQLString, resolve: resolvePath(['about', 'goals', 'home']) },
		videoLink: { type: GraphQLString, resolve: doc => doc.videoLink[0] && doc.videoLink[0].url },
		scorer: { type: GameGoalPlayer, resolve: doc => pathOr({}, ['players', 0], doc) },
		assists: { 
			type: new GraphQLList(GameGoalPlayer), 
			resolve: doc => filter(player => player.playerType	== 'Assist', doc.players || []), 
		},
	},
})

const Game = new GraphQLObjectType({
	name: 'Game',
	fields: {
		recap: {
			type: GraphQLString,
			resolve: doc => gameHighlightsLoader.load(doc.id).then(resolveProp('recap'))
		},
		hasShootout: { 
			type: GraphQLBoolean, 
			resolve: doc => gameLivefeedLoader
				.load(doc.id)
				.then(livefeed => pathOr(false, ['liveData', 'linescore', 'hasShootout'], livefeed)) 
		},
		shootoutWinner: { 
			type: GraphQLString, 
			resolve: doc => gameLivefeedLoader
				.load(doc.id)
				.then(livefeed => {
					const awayScore = pathOr(0, ['liveData', 'linescore', 'shootoutInfo', 'away', 'scores'], livefeed)
					const homeScore = pathOr(0, ['liveData', 'linescore', 'shootoutInfo', 'home', 'scores'], livefeed)
					if (awayScore > homeScore) {
						return 'away'
					} else if (homeScore > awayScore) {
						return 'home'
					} 
					
					return null
				})
		},
		lastEventPeriod: {
			type: GraphQLInt,
			resolve: doc => gameHighlightsLoader
				.load(doc.id)
        .then(liveFeed => pathOr(0, ['currentPlay', 'about', 'period'], liveFeed))
		},
		penalties: {
			type: new GraphQLList(GamePenatly),
			resolve: doc => gameLivefeedLoader
				.load(doc.id)
				.then((livefeed) => {
					const penalties = livefeed.liveData.plays.penaltyPlays.map((eventId) => {
						return livefeed.liveData.plays.allPlays[eventId]
					})
					return penalties
				})
		},
		goals: {
			type: new GraphQLList(GameGoal),
			resolve: doc => Promise.all([
				gameLivefeedLoader.load(doc.id),
				gameHighlightsLoader.load(doc.id),
			]).then(([livefeed, highlights]) => {
				const goalPlays = livefeed.liveData.plays.scoringPlays.map((eventId) => {
					return livefeed.liveData.plays.allPlays[eventId]
				})
				goalPlays.forEach((play) => {
					play.videoLink = highlights.goalsHighlights.filter(highlight => parseInt(highlight.statsEventId) == parseInt(play.about.eventId))
				})
				return goalPlays
			})
		},
		statusText: { 
      type: GraphQLString, 
      resolve: (doc) => gameLivefeedLoader
        .load(doc.id)
        .then(liveFeed => getStatusText(liveFeed.gameData, liveFeed))
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