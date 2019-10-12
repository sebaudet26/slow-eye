const DataLoader = require('dataloader')


const PlayerBio = new GraphQLObjectType({
  name: 'TeamRanking',
  fields: {
    
  },
});

const PlayerDraft = new GraphQLObjectType({
	name: 'PlayerDraft',
	fields: {

	},
});

const PlayerCareer = new GraphQLObjectType({
	name: 'PlayerCareer',
	fields: {

	},
});

const PlayerGameLogs = new GraphQLObjectType({
	name: 'PlayerGameLogs',
	fields: {

	},
});

const PlayerStats = new GraphQLObjectType({
	name: 'PlayerStats',
	fields: {

	},
});


const playerLoader = new DataLoader(keys => myBatchGetUsers(keys));