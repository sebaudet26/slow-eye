const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')

const { assert } = chai
const testData = require('../../testData/apiResponses.json')

const expectedUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339'

const fakeFetch = sinon.stub().resolves(testData[expectedUrl])

class FakeApi{
  constructor() {
    this.fetch = fakeFetch
  }
}

const { playerLoader } = proxyquire('./nhl', {
  '../../libs/api/api': FakeApi,
})

describe('nhl loader', function() {
  afterEach(() => {
    fakeFetch.resetHistory()
  })

  it('does not make multiple requests to the same resource', async function() {
  	await playerLoader.load('8479339').then(() => playerLoader.load('8479339'))
    sinon.assert.calledOnce(fakeFetch)
  })
})