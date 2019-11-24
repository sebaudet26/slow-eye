const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql')

const NHLQuery = require('./nhl')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      nhl: { type: NHLQuery, resolve: (_, args) => args }
    },
  })
})

module.exports = schema