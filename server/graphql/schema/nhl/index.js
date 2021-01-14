const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql')

const Player = require('./player')
const Streaks = require('./streaks')
const Standings = require('./standings')
const Report = require('./report')
const Team = require('./team')
const ScheduledGame = require('./schedule')
const Game = require('./game')

const { flatten, prop, sortBy } = require('ramda')

const {
  providedArgs,
} = require('./deconstructors')

const {
  teamsLoader,
  gamesScheduleLoader,
  playersLoader,
} = require('../../loaders/nhl')

const CURRENT_SEASON = '20202021'

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
    name: { type: GraphQLString, resolve: doc => doc.skaterFullName || doc.goalieFullName },
    birthDate: { type: GraphQLString, resolve: doc => doc.birthDate },
    nationality: { type: GraphQLString, resolve: doc => doc.nationalityCode },
    position: { type: GraphQLString, resolve: doc => doc.positionCode || 'G' },

  }
})

const NHLQuery = new GraphQLObjectType({
  name: 'NHLQuery',
  fields: {

    streaks: {
      type: Streaks,
      resolve: providedArgs,
    },

    player: {
      type: Player,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: providedArgs,
    },

    schedule: {
      type: new GraphQLList(ScheduledGame),
      args: {
        dates: { type: new GraphQLList(GraphQLString) },
      },
      resolve: (_, args) => Promise
        .all((args.dates || []).map(date => gamesScheduleLoader.load(date)))
        .then(games => flatten(games))
    },

    game: {
      type: Game,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: providedArgs,
    },

    team: {
      type: Team,
      args: {
        id: { type: GraphQLInt },
        season: { type: GraphQLString, defaultValue: CURRENT_SEASON },
      },
      resolve: providedArgs,
    },

    leaders: {
      type: Report,
      args: {
        season: { type: GraphQLString, defaultValue: CURRENT_SEASON },
      },
      resolve: providedArgs,
    },

    standings: {
      type: Standings,
      args: {
        season: { type: GraphQLString, defaultValue: CURRENT_SEASON },
      },
      resolve: providedArgs,
    },

    players: {
      type: new GraphQLList(PlayerName),
      args: {
        season: { type: GraphQLString, defaultValue: CURRENT_SEASON },
      },
      resolve: (_, args) => playersLoader.load(args.season).then((players) => {
        return sortBy(prop('playerName'), flatten(players))
      }),
    },

    teams: {
      type: new GraphQLList(Team),
      args: {
        season: { type: GraphQLString, defaultValue: CURRENT_SEASON },
      },
      resolve: (_, args) => teamsLoader.load(args.season).then((teams) => {
        return sortBy(prop('name'), teams)
      }),
    },
  },
})

module.exports = NHLQuery
