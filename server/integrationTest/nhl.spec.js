const request = require('supertest')

const queries = require('./queries')

const server = require('../server')

describe('nhl', () => {
	it('players', () => {
		return request(server)
		  .post('/graphql')
		  .send({ query: queries.players })
		  .then((res) => {
		    console.log(res)
		  });
	})
})