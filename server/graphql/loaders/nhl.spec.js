const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')

const { assert } = chai
const testData = require('../../testData/apiResponses.json')
const expectedData = require('../../testData/expectedData.js')

const playerBioUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339'
const playerDraftUrl = 'https://records.nhl.com/site/api/draft?cayenneExp=playerId=8479339'
const playerSeasonStatsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=yearByYear'
const playerPlayoffsStatsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=yearByYearPlayoffs'
const playerSeasonGameLogsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=gameLog'
const playerPlayoffsGameLogsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=playoffGameLog'

let fakeFetch 

stubFetchToReturnResponseFrom = (url) => {
  fakeFetch = sinon.stub().resolves(testData[url])
}

class FakeApi{
  constructor() {
    this.fetch = fakeFetch
  }
}

const nhlLoaders = proxyquire('./nhl', {
  '../../libs/api/api': FakeApi,
})

const { 
  playerBioLoader, 
  playerDraftLoader,
  playerCareerSeasonStatsLoader, 
  playerCareerPlayoffsStatsLoader,
  playerSeasonGameLogsLoader,
  playerPlayoffsGameLogsLoader,
} = nhlLoaders

describe('nhl loader', function() {
  afterEach(() => {
    fakeFetch.resetHistory()
  })

  it('does not make multiple requests to the same resource', async function() {
    stubFetchToReturnResponseFrom(playerBioUrl)
  	await playerBioLoader.load('8479339').then(() => playerBioLoader.load('8479339'))
    sinon.assert.calledOnce(fakeFetch)
  })

  it('playerBioLoader loads player bio', async function() {
    stubFetchToReturnResponseFrom(playerBioUrl)
    const bio = await playerBioLoader.load('8479339')
    assert.deepEqual(bio, testData[playerBioUrl].people[0])
  })

  it('playerDraftLoader loads player draft info', async function() {
    stubFetchToReturnResponseFrom(playerDraftUrl)
    const draft = await playerDraftLoader.load('8479339')
    assert.deepEqual(draft, testData[playerDraftUrl].data[0])
  })

  it('playerCareerSeasonStatsLoader loads player career season stats', async function() {
    stubFetchToReturnResponseFrom(playerSeasonStatsUrl)
    const seasonStats = await playerCareerSeasonStatsLoader.load('8479339')
    assert.deepEqual(seasonStats, expectedData.playerCareerSeasonStats)
  })

  it('playerCareerPlayoffsStatsLoader loads player career playoffs stats', async function() {
    stubFetchToReturnResponseFrom(playerPlayoffsStatsUrl)
    const playoffStats = await playerCareerPlayoffsStatsLoader.load('8479339')
    assert.deepEqual(playoffStats, expectedData.playerCareerPlayoffStats)
  })

  it('playerSeasonGameLogsLoader loads player season game logs', async function() {
    stubFetchToReturnResponseFrom(playerSeasonGameLogsUrl)
    const seasonGameLogs = await playerSeasonGameLogsLoader.load('8479339')
    assert.deepEqual(seasonGameLogs, testData[playerSeasonGameLogsUrl].stats[0].splits)
  })

  it('playerPlayoffsGameLogsLoader loads player playoffs game logs', async function() {
    stubFetchToReturnResponseFrom(playerPlayoffsGameLogsUrl)
    const seasonGameLogs = await playerPlayoffsGameLogsLoader.load('8479339')
    assert.deepEqual(seasonGameLogs, testData[playerPlayoffsGameLogsUrl].stats[0].splits)
  })
})