const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')
const { map, omit } = require('ramda')

const { assert } = chai

const ApiRequest = require('../../libs/api/api')
const testData = require('../../testData/apiResponses.json')
const expectedData = require('../../testData/expectedData.js')

const playerBioUrl = 'https://statsapi.web.nhl.com/api/v1/people/8479339'

let fakeData
let fakeFetch = sinon.stub()

function stubFetchToReturn(data) {
  fakeData = data
}

class FakeApi {
  constructor(args) {
    const { url } = new ApiRequest({ ...args, skipCache: true })
    console.log(url)
    this.fetch = () => {
      fakeFetch()
      return Promise.resolve(fakeData || testData[url])
    }
  }
}

const nhlLoaders = proxyquire('./mlb', {
  '../../libs/api/api': FakeApi,
})

const {
	teamsLoader,
	teamsStandingsLoader,
	playersBattingLeadersLoader,
	playersPitchingLeadersLoader,
	playerLoader,
} = nhlLoaders

describe('mlb loaders', function() {
  afterEach(() => {
    fakeData = null
    fakeFetch.resetHistory()
  })

  describe('basic functionality', () => {
    it('batching: does not make multiple requests to the same resource', async function() {
    	await teamsLoader.load('2019').then(() => teamsLoader.load('2019'))

      sinon.assert.calledOnce(fakeFetch)
    })
  })

  describe('teams', () => {
    it('teamsLoader loads teams for a given season', async function() {
      const teams = await teamsLoader.load('2019')

      const expectedFields = [
        'phone_number',       'venue_name',        'franchise_code',
        'all_star_sw',        'sport_code',        'address_city',
        'city',               'name_display_full', 'spring_league_abbrev',
        'time_zone_alt',      'sport_id',          'venue_id',
        'mlb_org_id',         'time_zone_generic', 'mlb_org',
        'last_year_of_play',  'league_full',       'home_opener_time',
        'address_province',   'league_id',         'name_abbrev',
        'bis_team_code',      'league',            'spring_league',
        'base_url',           'address_zip',       'sport_code_display',
        'mlb_org_short',      'time_zone',         'address_line1',
        'mlb_org_brief',      'address_line2',     'season',
        'address_line3',      'division_abbrev',   'name_display_short',
        'team_id',            'active_sw',         'address_intl',
        'state',              'address_country',   'mlb_org_abbrev',
        'division',           'team_code',         'name',
        'website_url',        'sport_code_name',   'first_year_of_play',
        'league_abbrev',      'name_display_long', 'store_url',
        'time_zone_text',     'name_short',        'home_opener',
        'address_state',      'division_full',     'time_zone_num',
        'spring_league_full', 'address',           'name_display_brief',
        'file_code',          'division_id',       'spring_league_id',
        'venue_short'
      ]

      assert.equal(teams.length, 30)
      teams.forEach(team => assert.containsAllKeys(team, expectedFields))
    })

    it('teamsStandingsLoader loads standings for a given season', async function () {
      const standings = await teamsStandingsLoader.load('2019')

      assert.equal(standings.length, 6)
      const expectedFields = [
        'standingsType',
        'league',
        'division',
        'sport',
        'lastUpdated',
        'teamRecords'
      ]
      const expectedDivisions = [
        "American League West",
        "American League East",
        "American League Central",
        "National League Central",
        "National League West",
        "National League East",
      ]

      standings.forEach(standing => assert.containsAllKeys(standing, expectedFields))
      const divisions = standings.map(standing => standing.division.name)
      assert.deepEqual(divisions, expectedDivisions)
    })

    it('playersBattingLeadersLoader loads batting leaders for a given season', async function() {
      const battingLeaders = await playersBattingLeadersLoader.load('2019')

      const expectedFields = [
        'gidp',
        'sac',
        'np',
        'name_display_first_last',
        'pos',
        'rank',
        'tb',
        'gidp_opp',
        'team_brief',
        'sport_id',
        'name_display_last_init',
        'bb',
        'avg',
        'slg',
        'ops',
        'hbp',
        'team_abbrev',
        'so',
        'wo',
        'league_id',
        'sf',
        'team',
        'league',
        'cs',
        'go_ao',
        'sb',
        'last_name',
        'player_id',
        'ibb',
        'player_qualifier',
        'roe',
        'team_id',
        'go',
        'hr',
        'minimum_qualifier',
        'gdp',
        'name_display_roster',
        'qualifies',
        'rbi',
        'lob',
        'babip',
        'name_first',
        'bats',
        'xbh',
        'g',
        'd',
        'team_name',
        'sport',
        'tpa',
        'name_display_last_first',
        'h',
        'obp',
        't',
        'ao',
        'r',
        'ab',
        'name_last'
      ]
      assert.equal(battingLeaders.length, 135)
      battingLeaders.forEach(leader => assert.containsAllKeys(leader, expectedFields))
    })

    it('playersPitchingLeadersLoader loads batting leaders for a given season', async function() {
      const pitchingLeaders = await playersPitchingLeadersLoader.load('2019')

      const expectedFields = [
        'gidp',
        'np',
        'name_display_first_last',
        'gf',
        'bqs',
        'k_9',
        'rank',
        'sho',
        'bq',
        'gidp_opp',
        'tb',
        'bk',
        'sport_id',
        'hr9',
        'sv',
        'name_display_last_init',
        'slg',
        'avg',
        'whip',
        'bb',
        'ops',
        'p_ip',
        'team_abbrev',
        'so',
        'tbf',
        'throws',
        'league_id',
        'wp',
        'team',
        'league',
        'hb',
        'cs',
        'pa',
        'go_ao',
        'sb',
        'last_name',
        'cg',
        'player_id',
        'ibb',
        'gs',
        'h_9',
        'player_qualifier',
        'team_id',
        'go',
        'pk',
        'hr',
        'bb_9',
        'minimum_qualifier',
        'irs',
        'wpct',
        'gdp',
        'era',
        'name_display_roster',
        'qualifies',
        'babip',
        'rs9',
        'qs',
        'ir',
        'g',
        'hld',
        'd',
        'k_bb',
        'team_name',
        'sport',
        'l',
        'svo',
        'name_display_last_first',
        'h',
        'ip',
        'obp',
        'w',
        't',
        's',
        'ao',
        'r',
        'pip',
        'ab',
        'name_last',
        'er'
      ]

      assert.equal(pitchingLeaders.length, 61)
      pitchingLeaders.forEach(leader => assert.containsAllKeys(leader, expectedFields))
    })

    it('playerLoader loads player info for agiven player id', async function() {
      const player = await playerLoader.load('547943')

      const expectedFields = [
        'id',              'fullName',
        'link',            'firstName',
        'lastName',        'primaryNumber',
        'birthDate',       'currentAge',
        'birthCity',       'birthCountry',
        'height',          'weight',
        'active',          'currentTeam',
        'primaryPosition', 'useName',
        'boxscoreName',    'nickName',
        'gender',          'isPlayer',
        'isVerified',      'pronunciation',
        'stats',           'mlbDebutDate',
        'batSide',         'pitchHand',
        'nameFirstLast',   'nameSlug',
        'firstLastName',   'lastFirstName',
        'lastInitName',    'initLastName',
        'fullFMLName',     'fullLFMName',
        'strikeZoneTop',   'strikeZoneBottom'
      ]
      
      assert.containsAllKeys(player, expectedFields)
    })
  })
})
