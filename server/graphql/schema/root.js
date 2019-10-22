const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLInt 
} = require('graphql')

const Player = require('./player')

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