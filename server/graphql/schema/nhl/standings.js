const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql')

const {
  toNumber,
  resolveProp,
  resolvePath,
} = require('./deconstructors/index')

const { flatten, takeLast } = require('ramda')

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
  name: 'Standing',
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
    divisionName: { type: GraphQLString, resolve: resolveProp('divisionName') },
    conferencName: { type: GraphQLString, resolve: resolveProp('conferenceName') },
    isWildCard: { type: GraphQLBoolean, resolve: resolveProp('isWildCard') },
    isDivisionLeader: { type: GraphQLBoolean, resolve: resolveProp('isDivisionLeader') },
  }
})

const Standings = new GraphQLObjectType({
	name: 'Standings',
	fields: {
		season: {
			type: GraphQLString,
			resolve: args => args.season
		},
		record: {
			type: new GraphQLList(Standing),
			resolve: args => teamsStandingsLoader.load(args.season).then((standings) => {
                console.log(standings)
                standings.forEach((standing) => {
                    console.log(standing.standingsType)
                    standing.teamRecords.forEach((record) => {
                        if (standing.conference) {
                            record.conferenceName = standing.conference.name
                        }
                        if (standing.division) {
                            record.divisionName = standing.division.name
                        }
                        if (standing.standingsType == 'divisionLeaders') {
                            record.isWildCard = false
                            record.isDivisionLeader = true
                        } else {
                            record.isWildCard = true
                            record.isDivisionLeader = false
                        }
                    })
                })
				return Promise.resolve(flatten(standings.map(standing => standing.teamRecords)))
			}),
		}
	}
})

module.exports = Standings