const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')
const { map, omit } = require('ramda')

const { assert } = chai

const ApiRequest = require('../../libs/api/api')
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

let fakeData
let fakeFetch = sinon.stub()

function stubFetchToReturn(data) {
  fakeData = data
}

class FakeApi {
  constructor(args) {
    const { url } = new ApiRequest({ ...args, skipCache: true })
    // console.log(url)
    this.fetch = () => {
      fakeFetch()
      return Promise.resolve(fakeData || testData[url])
    }
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

  streakLoader,
} = nhlLoaders

describe('nhl loader', function() {
  afterEach(() => {
    fakeData = null
    fakeFetch.resetHistory()
  })

  describe('basic functionality', () => {
    it('batching: does not make multiple requests to the same resource', async function() {
    	await playerBioLoader.load('8479339').then(() => playerBioLoader.load('8479339'))

      sinon.assert.calledOnce(fakeFetch)
    })
  })

  describe('player', () => {
    it('playerBioLoader loads player bio', async function() {
      const bio = await playerBioLoader.load('8479339')

      const expectedFields = [
        'id',               'fullName',
        'link',             'firstName',
        'lastName',         'primaryNumber',
        'birthDate',        'currentAge',
        'birthCity',        'birthCountry',
        'nationality',      'height',
        'weight',           'active',
        'alternateCaptain', 'captain',
        'rookie',           'shootsCatches',
        'rosterStatus',     'currentTeam',
        'primaryPosition'
      ]
      assert.containsAllKeys(bio, expectedFields)
    })

    it('playerDraftLoader loads player draft info', async function() {
      const draft = await playerDraftLoader.load('8479339')

      const expectedFields = [
        'id',                 'amateurClubName',
        'amateurLeague',      'birthDate',
        'birthPlace',         'countryCode',
        'csPlayerId',         'draftYear',
        'draftedByTeamId',    'firstName',
        'height',             'lastName',
        'overallPickNumber',  'pickInRound',
        'playerId',           'playerName',
        'position',           'removedOutright',
        'removedOutrightWhy', 'roundNumber',
        'shootsCatches',      'supplementalDraft',
        'teamPickHistory',    'triCode',
        'weight'
      ]
      assert.containsAllKeys(draft, expectedFields)
    })

    it('playerCareerSeasonStatsLoader loads player career season stats', async function() {
      const seasonStats = await playerCareerSeasonStatsLoader.load('8479339')

      const expectedFields = [ 'season', 'stat', 'team', 'league', 'sequenceNumber' ]
      const expectedStats = [
        'assists',
        'goals',
        'pim',
        'shots',
        'games',
        'powerPlayGoals',
        'penaltyMinutes',
        'gameWinningGoals',
        'shortHandedGoals',
        'plusMinus',
        'points'
      ]

      assert.equal(seasonStats.length, 6)
      seasonStats.forEach(season => assert.containsAllKeys(season.stat, expectedStats))
    })

    it('playerCareerPlayoffsStatsLoader loads player career playoffs stats', async function() {
      const playoffStats = await playerCareerPlayoffsStatsLoader.load('8479339')

      const expectedFields = [ 'season', 'stat', 'team', 'league', 'sequenceNumber' ]
      const expectedStats = [
        'timeOnIce',            'assists',
        'goals',                'pim',
        'shots',                'games',
        'hits',                 'powerPlayGoals',
        'powerPlayPoints',      'powerPlayTimeOnIce',
        'evenTimeOnIce',        'penaltyMinutes',
        'faceOffPct',           'shotPct',
        'gameWinningGoals',     'overTimeGoals',
        'shortHandedGoals',     'shortHandedPoints',
        'shortHandedTimeOnIce', 'blocked',
        'plusMinus',            'points',
        'shifts'
      ]

      assert.equal(playoffStats.length, 2)
      playoffStats.forEach((playoff) => {
        assert.containsAllKeys(playoff, expectedFields)
        assert.containsAllKeys(playoff.stat, expectedStats)
      })
    })

    it('playerSeasonGameLogsLoader loads player season game logs', async function() {
      const seasonGameLogs = await playerSeasonGameLogsLoader.load('8479339')

      const expectedFields = [
        'season', 'stat',
        'team',   'opponent',
        'date',   'isHome',
        'isWin',  'isOT',
        'game'
      ]
      assert.equal(seasonGameLogs.length, 9)
      seasonGameLogs.forEach(log => assert.containsAllKeys(log, expectedFields))
    })

    it.skip('TBD playerPlayoffsGameLogsLoader loads player playoffs game logs', async function() {
      const playoffGameLogs = await playerPlayoffsGameLogsLoader.load('8479339')

      assert.deepEqual(playoffGameLogs, [])
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
      const teamInfo = await teamInfoLoader.load('26')

      const expectedFields = [
        'id',              'name',
        'link',            'venue',
        'abbreviation',    'teamName',
        'locationName',    'firstYearOfPlay',
        'division',        'conference',
        'franchise',       'shortName',
        'officialSiteUrl', 'franchiseId',
        'active'
      ]
      assert.containsAllKeys(teamInfo, expectedFields)
    })

    it('teamStatsLoader loads team stats', async function() {
      const teamStats = await teamStatsLoader.load('20182019:26')

      const expectedStats = [
        'gamesPlayed',            'wins',
        'losses',                 'ot',
        'pts',                    'ptPctg',
        'goalsPerGame',           'goalsAgainstPerGame',
        'evGGARatio',             'powerPlayPercentage',
        'powerPlayGoals',         'powerPlayGoalsAgainst',
        'powerPlayOpportunities', 'penaltyKillPercentage',
        'shotsPerGame',           'shotsAllowed',
        'winScoreFirst',          'winOppScoreFirst',
        'winLeadFirstPer',        'winLeadSecondPer',
        'winOutshootOpp',         'winOutshotByOpp',
        'faceOffsTaken',          'faceOffsWon',
        'faceOffsLost',           'faceOffWinPercentage',
        'shootingPctg',           'savePctg'
      ]
      const expectedRankings = [
        'wins',
        'losses',
        'ot',
        'pts',
        'ptPctg',
        'goalsPerGame',
        'goalsAgainstPerGame',
        'evGGARatio',
        'powerPlayPercentage',
        'powerPlayGoals',
        'powerPlayGoalsAgainst',
        'powerPlayOpportunities',
        'penaltyKillOpportunities',
        'penaltyKillPercentage',
        'shotsPerGame',
        'shotsAllowed',
        'winScoreFirst',
        'winOppScoreFirst',
        'winLeadFirstPer',
        'winLeadSecondPer',
        'winOutshootOpp',
        'winOutshotByOpp',
        'faceOffsTaken',
        'faceOffsWon',
        'faceOffsLost',
        'faceOffWinPercentage',
        'savePctRank',
        'shootingPctRank'
      ]
      assert.containsAllKeys(teamStats, ['stats', 'rankings'])
      assert.containsAllKeys(teamStats.stats, expectedStats)
      assert.containsAllKeys(teamStats.rankings, expectedRankings)
    })

    it('teamRosterLoader loads team rosters', async function() {
      const teamRoster = await teamRosterLoader.load('20182019:26')

      const expectedFields = [ 'id', 'fullName', 'link', 'jerseyNumber', 'position' ]
      assert.equal(teamRoster.length, 37)
      teamRoster.forEach(player => assert.containsAllKeys(player, expectedFields))
    })
  })

  describe('teams', () => {
    it('teamsLoader loads teams', async function() {
      const teams = await teamsLoader.load('20192020')

      const expectedFields = [
        'id',              'name',
        'link',            'venue',
        'abbreviation',    'teamName',
        'locationName',    'firstYearOfPlay',
        'division',        'conference',
        'franchise',       'shortName',
        'officialSiteUrl', 'franchiseId',
        'active'
      ]
      assert.equal(teams.length, 31)
      teams.forEach(team => assert.containsAllKeys(team, expectedFields))
    })

    it('teamsStandingsLoader loads teams standings', async function() {
      const teamsStandings = await teamsStandingsLoader.load('20182019')

      const expectedFields = [ 'standingsType', 'league', 'conference', 'season', 'teamRecords' ]
      const expectedStats = [
        'team',               'leagueRecord',
        'goalsAgainst',       'goalsScored',
        'points',             'divisionRank',
        'divisionL10Rank',    'divisionRoadRank',
        'divisionHomeRank',   'conferenceRank',
        'conferenceL10Rank',  'conferenceRoadRank',
        'conferenceHomeRank', 'leagueRank',
        'leagueL10Rank',      'leagueRoadRank',
        'leagueHomeRank',     'wildCardRank',
        'row',                'gamesPlayed',
        'streak',             'records',            
        'lastUpdated'
      ]
      assert.containsAllKeys(teamsStandings, expectedFields)
      assert.equal(teamsStandings.teamRecords.length, 10)
      teamsStandings.teamRecords.forEach(standing => assert.containsAllKeys(standing, expectedStats))
    })
  })

  describe('game', () => {
    it('gameBoxscoreLoader loads boxscore', async function() {
      const gameBoxscore = await gameBoxscoreLoader.load('2019020067')

      const expectedTeamFields = [
        'team',       'teamStats',
        'players',    'goalies',
        'skaters',    'onIce',
        'onIcePlus',  'scratches',
        'penaltyBox', 'coaches'
      ]

      assert.containsAllKeys(gameBoxscore.away, expectedTeamFields)
      assert.containsAllKeys(gameBoxscore.home, expectedTeamFields)
    })

    it('gameLivefeedLoader loads livefeed', async function() {
      const gameLivefeed = await gameLivefeedLoader.load('2019020067')

      const expectedFields = [ 'copyright', 'gamePk', 'link', 'metaData', 'gameData', 'liveData' ]
      assert.containsAllKeys(gameLivefeed, expectedFields)
    })

    it('gameHighlights loads highlights', async function() {
      const gameHighlights = await gameHighlightsLoader.load('2019020067')

      assert.containsAllKeys(gameHighlights, ['recap', 'goalsHighlights'])
      assert.equal(gameHighlights.recap, 'http://md-akc.med.nhl.com/mp4/nhl/2019/10/13/508d4c0e-b44f-480e-842f-a5b157a9c75c/1570935302686/asset_1800k.mp4')
      assert.equal(gameHighlights.goalsHighlights.length, 5)
      gameHighlights.goalsHighlights.forEach(goal => assert.containsAllKeys(goal, [ 'statsEventId', 'periodTime', 'period', 'url' ]))
    })
  })

  describe('games', () => {
    it('gamesSchedule', async function() {
      const gamesSchedule = await gamesScheduleLoader.load('2019-10-13')

      const expectedFields = [
        'gamePk',   'link',
        'gameType', 'season',
        'gameDate', 'status',
        'teams',    'venue',
        'content'
      ]
      assert.equal(gamesSchedule.length, 3)
      gamesSchedule.forEach(game => assert.containsAllKeys(game, expectedFields))
    })
  })

  describe('streaks', () => {
    it('returns teams streaks', async function () {
      const hotTeams = await streakLoader.load('teams')
      
      const expectedHotTeam = {
        id: 1,
        name: 'New Jersey Devils',
        teamName: 'Devils',
        abbreviation: 'NJD',
        streak: { wins: 0, losses: 3, ot: 2, games: 5, points: 2 }
      }
      assert.equal(hotTeams.length, 31)
      assert.deepEqual(hotTeams[0], expectedHotTeam)
    })    

    it('returns players streaks', async function () {
      const hotPlayers = await streakLoader.load('players')
      
      const expectedHotPlayer = {
        streak: {
          points: 9,
          goals: 3,
          assists: 6,
          shots: 13,
          hits: 5,
          pim: 2,
          powerPlayPoints: 5,
          plusMinus: 4,
          games: 5
        },
        playerName: 'Connor McDavid',
        playerTeamsPlayedFor: 'EDM',
        playerPositionCode: 'C'
      }
      assert.equal(hotPlayers.length, 653)
      assert.deepEqual(hotPlayers[0], expectedHotPlayer)
    })
  })
})