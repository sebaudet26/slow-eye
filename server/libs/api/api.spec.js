const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')

const { assert } = chai
const testData = require('../../integrationTest/recordedResponses.json')

const fakeCache = {
	get: sinon.stub().resolves(null),
	set: sinon.stub().resolves(true),
}

const expectedUrl = 'https://statsapi.web.nhl.com/api/v1/people/8477956'

const fakeFetch = sinon
  .stub()
  .resolves({ json: () => Promise.resolve(testData[expectedUrl]) })

const ApiRequest = proxyquire('./api', {
  './../redis': { instance: fakeCache, connected: true },
  'node-fetch': fakeFetch,
})

describe('api', function() {
  afterEach(() => {
    fakeCache.get.resetHistory()
    fakeCache.set.resetHistory()
  })

  it('can send a request for a player', async function() {
  	const request = new ApiRequest({
      league: 'NHL',
  		apiType: 'STATS_API',
  		resource: '/people/8477956',
  		skipCache: true
  	})

  	await request.fetch()
  	assert.deepEqual(request.data, testData[expectedUrl])
  })

  it('does not interact with the cache if skipCache is set', async function() {
  	const request = new ApiRequest({
      league: 'NHL',
  		apiType: 'STATS_API',
  		resource: '/people/8477956',
  		skipCache: true
  	})

  	await request.fetch()
  	assert(!fakeCache.get.called)
  	assert(!fakeCache.set.called)
  })

  it('tries to fetch from the cache and sets it to the cache if skipCache is not set', async function() {
  	const request = new ApiRequest({
      league: 'NHL',
  		apiType: 'STATS_API',
  		resource: '/people/8477956',
  	})

  	await request.fetch()
  	assert(fakeCache.get.called)
    sinon.assert.calledWith(fakeCache.get, expectedUrl)
  	assert(fakeCache.set.called)
    sinon.assert.calledWith(
      fakeCache.set,
      expectedUrl,
      JSON.stringify(testData[expectedUrl]),
      'EX',
    )
  })

  it('returns early if data was in the cache', async function() {
    fakeCache.get = sinon.stub().resolves(JSON.stringify(testData[expectedUrl]))
    const request = new ApiRequest({
      league: 'NHL',
      apiType: 'STATS_API',
      resource: '/people/8477956',
    })

    await request.fetch()
    assert(fakeCache.get.called)
    sinon.assert.calledWith(fakeCache.get, expectedUrl)
    assert(!fakeCache.set.called)
  })
})