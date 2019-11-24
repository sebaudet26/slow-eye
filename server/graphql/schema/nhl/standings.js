const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql')

const {
  toNumber,
  resolveProp,
  resolvePath,
} = require('./deconstructors/index')

const { teamsStandingsLoader } = require('../../loaders/nhl')

const Conference = new GraphQLObjectType({
	name: 'Conference',
	fields: {
		id: { type: GraphQLInt, resolve: resolveProp('id') },
		name: { type: GraphQLString, resolve: resolveProp('name') },
	}
})

const Ranking = new GraphQLObjectType({
	name: 'Ranking',
	fields: {
		divisionRank: {
			type: GraphQLInt,
			resolve: ranking => resolveProp('divisionRank')(ranking).then(toNumber)
		},
		conferenceRank: {
			type: GraphQLInt,
			resolve: ranking => resolveProp('conferenceRank')(ranking).then(toNumber)
		},
		leagueRank: {
			type: GraphQLInt,
			resolve: ranking => resolveProp('leagueRank')(ranking).then(toNumber)
		},
	}
})

const Record = new GraphQLObjectType({
	name: 'Record',
	fields: {
		wins: { type: GraphQLInt, resolve: resolveProp('wins') },
		losses: { type: GraphQLInt, resolve: resolveProp('losses') },
		ot: { type: GraphQLInt, resolve: resolveProp('ot') },
	}
})

const Standing = new GraphQLObjectType({
  name: 'Standings',
  fields: {
    goalsAgainst: {
    	type: GraphQLInt,
    	resolve: resolveProp('goalsAgainst'),
    },
    goalsScored: {
    	type: GraphQLInt,
    	resolve: resolveProp('goalsScored'),
    },
    points: {
    	type: GraphQLInt,
    	resolve: resolveProp('points'),
    },
    divisionRank: {
    	type: GraphQLInt,
    	resolve: (doc) => resolveProp('divisionRank')(doc).then(toNumber),
    },
    conferenceRank: {
    	type: GraphQLInt,
    	resolve: (doc) => resolveProp('conferenceRank')(doc).then(toNumber),
    },
    leagueRank: {
    	type: GraphQLInt,
    	resolve: (doc) => resolveProp('leagueRank')(doc).then(toNumber),
    },
    wildCardRank: {
    	type: GraphQLInt,
    	resolve: (doc) => resolveProp('wildCardRank')(doc).then(toNumber),
    },
    gamesPlayed: {
    	type: GraphQLInt,
    	resolve: resolveProp('gamesPlayed'),
    },
    streak: {
    	type: GraphQLString,
    	resolve: resolvePath(['streak', 'streakCode']),
    },
    record: {
    	type: Record,
    	resolve: resolveProp(['leagueRecord'])
    },
    awayRecord: {
    	type: Record,
    	resolve: resolvePath(['records', 'overallRecords', 0]),
    },
    homeRecord: {
    	type: Record,
    	resolve: resolvePath(['records', 'overallRecords', 1]),
    },
    shootOutsRecord: {
    	type: Record,
    	resolve: resolvePath(['records', 'overallRecords', 2]),
    },
    lastTenRecord: {
    	type: Record,
    	resolve: resolvePath(['records', 'overallRecords', 3]),
    },
    teamId: { type: GraphQLInt, resolve: resolvePath(['team', 'id']) },
    teamName: { type: GraphQLString, resolve: resolvePath(['team', 'name']) },
  }
})

const Standings = new GraphQLObjectType({
	name: 'Standing',
	fields: {
		season: {
			type: GraphQLString,
			resolve: args => args.season
		},
		wildCard: {
			type: new GraphQLList(Standing),
			resolve: args => teamsStandingsLoader.load(args.season).then((standings) => {
				const eastern = standings[0]
				const western = standings[1]
				eastern.teamRecords.forEach((record) => {
					record.conference = eastern.conference.name
				})
				western.teamRecords.forEach((record) => {
					record.conference = western.conference.name
				})
				return Promise.resolve([...eastern.teamRecords, ...western.teamRecords])
			}),
		}
	}
})

module.exports = Standings