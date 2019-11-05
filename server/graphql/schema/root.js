const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} = require('graphql')

const Player = require('./player')
const Streaks = require('./streaks')

const itself = () => ({})

const NHLQuery = new GraphQLObjectType({
  name: 'NHLQuery',
  fields: {
    player: {
      type: Player,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) =>  ({ id: args.id })
    },
    streaks: {
      type: Streaks,
      resolve: itself,
    }
  },
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      nhl: { type: NHLQuery, resolve: itself }
    },
  })
})

module.exports = schema