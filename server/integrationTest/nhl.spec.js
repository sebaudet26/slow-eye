const request = require('supertest')
const chai = require('chai')
const queries = require('./queries')
const server = require('../server')

const assert = chai.assert
process.env.USE_RECORDINGS = 'true'

describe('nhl', () => {
	it('players', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.players })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('game', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.game })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('schedule', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.schedule })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('team', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.team })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('teams', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.teams })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('leaders', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.leaders })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('standings', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.standings })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('playersStreaks', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.playersStreaks })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('player', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.player })
		  .expect(200)
		  .end((err, res) => {
		  })
	})

	it('teamsStreaks', () => {
		request(server)
		  .post('/graphql')
		  .send({ query: queries.teamsStreaks })
		  .expect(200)
		  .end((err, res) => {
		  })
	})
})