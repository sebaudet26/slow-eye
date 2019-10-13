const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')
const { map, omit } = require('ramda')

const { assert } = chai
const testData = require('../../testData/apiResponses.json')
const expectedData = require('../../testData/expectedData.js')

const playerBioUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339'
const playerDraftUrl = 'https://records.nhl.com/site/api/draft?cayenneExp=playerId=8479339'
const playerSeasonStatsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=yearByYear'
const playerPlayoffsStatsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=yearByYearPlayoffs'
const playerSeasonGameLogsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=gameLog'
const playerPlayoffsGameLogsUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339/stats?stats=playoffGameLog'

const teamsUrl = 'https://statsapi.web.nhl.com/api/v1/teams?season=20192020'
const teamInfoUrl = 'https://statsapi.web.nhl.com/api/v1/teams/26'
const teamStatsUrl = 'https://statsapi.web.nhl.com/api/v1/teams/26/stats?stats=statsSingleSeason&season=20182019'
const teamRosterUrl = 'https://statsapi.web.nhl.com/api/v1/teams/26/roster?season=20182019'
const teamsStandingsUrl = 'https://statsapi.web.nhl.com/api/v1/standings/wildCardWithLeaders?expand=standings.record&season=20182019'

const gameBoxscoreUrl = 'https://statsapi.web.nhl.com/api/v1/game/2019020067/boxscore'
const gameLivefeedUrl = 'https://statsapi.web.nhl.com/api/v1/game/2019020067/feed/live' 
const gameHighlightsUrl = 'https://statsapi.web.nhl.com/api/v1/game/2019020067/content'

const gamesScheduleUrl = 'https://statsapi.web.nhl.com/api/v1/schedule?date=2019-10-13'

let fakeFetch 

const stubFetchToReturnResponseFrom = (url) => {
  fakeFetch = sinon.stub().resolves(testData[url])
}

const stubFetchToReturn = (data) => {
  fakeFetch = sinon.stub().resolves(data)
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
  playersLoader,
  playersReportLoader,

  teamInfoLoader,
  teamStatsLoader,
  teamRosterLoader,
  teamsLoader,
  teamsStandingsLoader,

  gameBoxscoreLoader,
  gameLivefeedLoader,
  gameHighlightsLoader,

  gamesScheduleLoader,

} = nhlLoaders

describe.only('nhl loader', function() {
  afterEach(() => {
    fakeFetch.resetHistory()
  })

  describe('basic functionality', () => {
    it('batching: does not make multiple requests to the same resource', async function() {
      stubFetchToReturnResponseFrom(playerBioUrl)
      
    	await playerBioLoader.load('8479339').then(() => playerBioLoader.load('8479339'))

      sinon.assert.calledOnce(fakeFetch)
    })
  })

  describe('player', () => {
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

  describe('players', () => {
    it('playersLoader loads all players in history with basic information only to minimize payload', async function() {
      const fakePlayer = {
        playerBirthDate: 1990, 
        playerName: 'a', 
        playerId: 1, 
        playerNationality: 'AUS', 
        playerPositionCode: 'C',
        ignored: 'this value'
      }
      stubFetchToReturn([{ data: fakePlayer }])

      const allPlayers = await playersLoader.load('all')

      assert.deepEqual(allPlayers, map(omit(['ignored']), [fakePlayer, fakePlayer]))
      sinon.assert.calledTwice(fakeFetch)
    })

    it('playersReportLoader returns a skaters report for a given season', async function() {
      const fakePlayer = {
        playerBirthDate: 1990, 
        playerName: 'a', 
        playerId: 1, 
        playerNationality: 'AUS', 
        playerPositionCode: 'C',
      }
      stubFetchToReturn([{ data: fakePlayer }])

      const skatersReport = await playersReportLoader.load('20192020:skaters')

      assert.equal(fakeFetch.callCount, 4)
    })

    it('playersReportLoader returns a goalies report for a given season', async function() {
      const fakePlayer = {
        playerBirthDate: 1990, 
        playerName: 'a', 
        playerId: 1, 
        playerNationality: 'AUS', 
        playerPositionCode: 'C',
      }
      stubFetchToReturn([{ data: fakePlayer }])

      const skatersReport = await playersReportLoader.load('20192020:goalies')

      assert.equal(fakeFetch.callCount, 2)
    })
  })

  describe('team', () => {
    it('teamInfo loads team info', async function() {
      stubFetchToReturnResponseFrom(teamInfoUrl)

      const teamInfo = await teamInfoLoader.load('26')

      assert.deepEqual(teamInfo, testData[teamInfoUrl].teams)
    })

    it('teamStatsLoader loads team stats', async function() {
      stubFetchToReturnResponseFrom(teamStatsUrl)

      const teamStats = await teamStatsLoader.load('20182019:26')

      assert.deepEqual(teamStats, expectedData.teamStats)
    })

    it('teamRosterLoader loads team rosters', async function() {
      stubFetchToReturnResponseFrom(teamRosterUrl)

      const teamRoster = await teamRosterLoader.load('20182019:26')

      assert.deepEqual(teamRoster, expectedData.teamRoster)
    })
  })

  describe('teams', () => {
    it('teamsLoader loads teams', async function() {
      stubFetchToReturnResponseFrom(teamsUrl)

      const teams = await teamsLoader.load('20192020')

      assert.deepEqual(teams, testData[teamsUrl].teams)
    })

    it('teamsStandings loads teams standings', async function() {
      stubFetchToReturnResponseFrom(teamsStandingsUrl)

      const teamsStandings = await teamsStandingsLoader.load('20182019')

      assert.deepEqual(teamsStandings, testData[teamsStandingsUrl].records[0])
    })
  })

  describe('game', () => {
    it('gameBoxscoreLoader loads boxscore', async function() {
      stubFetchToReturnResponseFrom(gameBoxscoreUrl)

      const gameBoxscore = await gameBoxscoreLoader.load('2019020067')

      assert.deepEqual(gameBoxscore, testData[gameBoxscoreUrl].teams)
    })

    it('gameLivefeedLoader loads livefeed', async function() {
      stubFetchToReturnResponseFrom(gameLivefeedUrl)

      const gameLivefeed = await gameLivefeedLoader.load('2019020067')

      assert.deepEqual(gameLivefeed, testData[gameLivefeedUrl])
    })

    it('gameHighlights loads highlights', async function() {
      stubFetchToReturnResponseFrom(gameHighlightsUrl)

      const gameHighlights = await gameHighlightsLoader.load('2019020067')

      assert.deepEqual(gameHighlights, expectedData.gameHighlights)
    })
  })

  describe('games', () => {
    it('gamesSchedule', async function() {
      stubFetchToReturnResponseFrom(gamesScheduleUrl)

      const gamesSchedule = await gamesScheduleLoader.load('2019-10-13')

      assert.deepEqual(gamesSchedule, testData[gamesScheduleUrl].dates[0].games)
    })
  })
})