const {
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');
const {
  pipe, prop, join, drop, path,
} = require('ramda');
const {
  fetchStandings,
  fetchStatsForPlayerId,
  fetchCurrentSeasonGameLogsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchInfoForPlayerId,
  fetchInfoForTeamId,
  fetchDraftInfoForPlayer,
  fetchAllPlayers,
  fetchGames,
  nhlAPI,
} = require('../libs/nhlApi');

const ifNotThereFetchLink = propName => async (d) => {
  if (d.link) {
    // FIXME: this is pretty bad
    const data = await nhlAPI(`/${join('/', drop(3, d.link.split('/')))}`);
    return path(['teams', 0, propName], data);
  }
  return prop(propName, d);
};

const Position = new GraphQLObjectType({
  name: 'Position',
  fields: {
    code: { type: GraphQLString, resolve: prop('code') },
    name: { type: GraphQLString, resolve: prop('name') },
    type: { type: GraphQLString, resolve: prop('type') },
    abbreviation: { type: GraphQLString, resolve: prop('abbreviation') },
  },
});


/* League Info

*/
const LeagueInfo = new GraphQLObjectType({
  name: 'LeagueInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    link: { type: GraphQLString, resolve: prop('link') },
  },
});

/* Team Info
{
  "id" : 5,
  "name" : "Pittsburgh Penguins",
  "link" : "/api/v1/teams/5",
  "venue" : {
    "id" : 5034,
    "name" : "PPG Paints Arena",
    "link" : "/api/v1/venues/5034",
    "city" : "Pittsburgh",
    "timeZone" : {
      "id" : "America/New_York",
      "offset" : -5,
      "tz" : "EST"
    }
  },
  "abbreviation" : "PIT",
  "teamName" : "Penguins",
  "locationName" : "Pittsburgh",
  "division" : {
    "id" : 18,
    "name" : "Metropolitan",
    "nameShort" : "Metro",
    "link" : "/api/v1/divisions/18",
    "abbreviation" : "M"
  },
  "conference" : {
    "id" : 6,
    "name" : "Eastern",
    "link" : "/api/v1/conferences/6"
  },
  "franchise" : {
    "franchiseId" : 17,
    "teamName" : "Penguins",
    "link" : "/api/v1/franchises/17"
  },
  "shortName" : "Pittsburgh",
  "officialSiteUrl" : "http://pittsburghpenguins.com/",
  "franchiseId" : 17,
  "active" : true
}
*/

const TeamInfo = new GraphQLObjectType({
  name: 'TeamInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    link: { type: GraphQLString, resolve: prop('link') },
    abbreviation: { type: GraphQLString, resolve: ifNotThereFetchLink('abbreviation') },
    teamName: { type: GraphQLString, resolve: ifNotThereFetchLink('teamName') },
    locationName: { type: GraphQLString, resolve: ifNotThereFetchLink('locationName') },
    shortName: { type: GraphQLString, resolve: ifNotThereFetchLink('shortName') },
    officialSiteUrl: { type: GraphQLString, resolve: ifNotThereFetchLink('officialSiteUrl') },
  },
});


/*
{
  "team" : {
    "id" : 6,
    "name" : "Boston Bruins",
    "link" : "/api/v1/teams/6"
  },
  "leagueRecord" : {
    "wins" : 18,
    "losses" : 12,
    "ot" : 4,
    "type" : "league"
  },
  "goalsAgainst" : 88,
  "goalsScored" : 94,
  "points" : 40,
  "divisionRank" : "4",
  "conferenceRank" : "5",
  "leagueRank" : "11",
  "wildCardRank" : "1",
  "row" : 17,
  "gamesPlayed" : 34,
  "streak" : {
    "streakType" : "wins",
    "streakNumber" : 1,
    "streakCode" : "W1"
  },
  "lastUpdated" : "2018-12-20T00:03:12Z",
  "records" : {
    "divisionRecords" : [ {
      "wins" : 3,
      "losses" : 3,
      "ot" : 2,
      "type" : "Central"
    }, {
      "wins" : 9,
      "losses" : 2,
      "ot" : 1,
      "type" : "Atlantic"
    }, {
      "wins" : 5,
      "losses" : 4,
      "ot" : 0,
      "type" : "Pacific"
    }, {
      "wins" : 8,
      "losses" : 3,
      "ot" : 1,
      "type" : "Metropolitan"
    } ],
    "overallRecords" : [ {
      "wins" : 12,
      "losses" : 6,
      "ot" : 2,
      "type" : "home"
    }, {
      "wins" : 13,
      "losses" : 6,
      "ot" : 2,
      "type" : "away"
    }, {
      "wins" : 3,
      "losses" : 1,
      "type" : "shootOuts"
    }, {
      "wins" : 6,
      "losses" : 3,
      "ot" : 1,
      "type" : "lastTen"
    } ],
    "conferenceRecords" : [ {
      "wins" : 17,
      "losses" : 5,
      "ot" : 2,
      "type" : "Eastern"
    }, {
      "wins" : 8,
      "losses" : 7,
      "ot" : 2,
      "type" : "Western"
    } ]
  },
}
*/

const Streak = new GraphQLObjectType({
  name: 'Streak',
  fields: {
    type: { type: GraphQLString, resolve: prop('streakType') },
    number: { type: GraphQLString, resolve: prop('streakNumber') },
    code: { type: GraphQLString, resolve: prop('streakCode') },
  },
});

const Record = new GraphQLObjectType({
  name: 'Record',
  fields: {
    wins: { type: GraphQLInt, resolve: prop('wins') },
    losses: { type: GraphQLInt, resolve: prop('losses') },
    ot: { type: GraphQLInt, resolve: prop('ot') },
    type: { type: GraphQLString, resolve: prop('type') },
  },
});

const Records = new GraphQLObjectType({
  name: 'Records',
  fields: {
    divisionRecords: { type: GraphQLList(Record), resolve: prop('divisionRecords') },
    overallRecords: { type: GraphQLList(Record), resolve: prop('overallRecords') },
    conferenceRecords: { type: GraphQLList(Record), resolve: prop('conferenceRecords') },
  },
});

const TeamRecord = new GraphQLObjectType({
  name: 'TeamRecord',
  fields: {
    team: { type: TeamInfo, resolve: prop('team') },
    leagueRecord: { type: Record, resolve: prop('leagueRecord') },
    goalsAgainst: { type: GraphQLInt, resolve: prop('goalsAgainst') },
    goalsScored: { type: GraphQLInt, resolve: prop('goalsScored') },
    points: { type: GraphQLInt, resolve: prop('points') },
    divisionRank: { type: GraphQLInt, resolve: pipe(prop('divisionRank'), Number) },
    conferenceRank: { type: GraphQLInt, resolve: pipe(prop('conferenceRank'), Number) },
    leagueRank: { type: GraphQLInt, resolve: pipe(prop('leagueRank'), Number) },
    wildCardRank: { type: GraphQLInt, resolve: pipe(prop('wildCardRank'), Number) },
    // row: { type: GraphQLInt, resolve: prop('row') },
    records: { type: Records, resolve: prop('records') },
    gamesPlayed: { type: GraphQLInt, resolve: prop('gamesPlayed') },
    streak: { type: Streak, resolve: prop('streak') },
  },
});

/*
    "division" : {
      "id" : 18,
      "name" : "Metropolitan",
      "nameShort" : "Metro",
      "link" : "/api/v1/divisions/18",
      "abbreviation" : "M"
    },

    "conference" : {
      "id" : 6,
      "name" : "Eastern",
      "link" : "/api/v1/conferences/6"
    },
*/

const ConferenceInfo = new GraphQLObjectType({
  name: 'ConferenceInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    link: { type: GraphQLString, resolve: prop('    link') },
  },
});

const DivisionInfo = new GraphQLObjectType({
  name: 'DivisionInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    nameShort: { type: GraphQLString, resolve: prop('nameShort') },
    abbreviation: { type: GraphQLString, resolve: prop('abbreviation') },
    link: { type: GraphQLString, resolve: prop('    link') },
  },
});

const StandingsRecord = new GraphQLObjectType({
  name: 'StandingsRecord',
  fields: {
    type: { type: GraphQLString, resolve: prop('standingsType') },
    league: { type: LeagueInfo, resolve: prop('league') },
    conference: { type: ConferenceInfo, resolve: prop('conference') },
    division: { type: DivisionInfo, resolve: prop('division') },
    teamRecords: { type: GraphQLList(TeamRecord), resolve: prop('teamRecords') },
  },
});

const DraftInfo = new GraphQLObjectType({
  name: 'DraftInfo',
  fields: {
    year: { type: GraphQLInt, resolve: prop('year') },
    round: { type: GraphQLInt, resolve: pipe(prop('round'), Number) },
    pickOverall: { type: GraphQLInt, resolve: prop('pickOverall') },
    pickInRound: { type: GraphQLInt, resolve: prop('pickInRound') },
    team: { type: TeamInfo, resolve: prop('team') },
  },
});


/* Player info
{
  "id" : 8476474,
  "fullName" : "Stefan Noesen",
  "link" : "/api/v1/people/8476474",
  "firstName" : "Stefan",
  "lastName" : "Noesen",
  "primaryNumber" : "23",
  "birthDate" : "1993-02-12",
  "currentAge" : 25,
  "birthCity" : "Plano",
  "birthStateProvince" : "TX",
  "birthCountry" : "USA",
  "nationality" : "USA",
  "height" : "6' 1\"",
  "weight" : 205,
  "active" : true,
  "alternateCaptain" : false,
  "captain" : false,
  "rookie" : false,
  "shootsCatches" : "R",
  "rosterStatus" : "Y",
  "currentTeam" : {
    "id" : 1,
    "name" : "New Jersey Devils",
    "link" : "/api/v1/teams/1"
  },
  "primaryPosition" : {
    "code" : "R",
    "name" : "Right Wing",
    "type" : "Forward",
    "abbreviation" : "RW"
  }
}
*/

const PlayerInfo = new GraphQLObjectType({
  name: 'PlayerInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    fullName: { type: GraphQLString, resolve: prop('fullName') },
    link: { type: GraphQLString, resolve: prop('link') },
    firstName: { type: GraphQLString, resolve: prop('firstName') },
    lastName: { type: GraphQLString, resolve: prop('lastName') },
    primaryNumber: { type: GraphQLString, resolve: prop('primaryNumber') },
    birthDate: { type: GraphQLString, resolve: prop('birthDate') },
    currentAge: { type: GraphQLInt, resolve: prop('currentAge') },
    birthCity: { type: GraphQLString, resolve: prop('birthCity') },
    birthStateProvince: { type: GraphQLString, resolve: prop('birthStateProvince') },
    birthCountry: { type: GraphQLString, resolve: prop('birthCountry') },
    nationality: { type: GraphQLString, resolve: prop('nationality') },
    height: { type: GraphQLString, resolve: prop('height') },
    weight: { type: GraphQLInt, resolve: prop('weight') },
    active: { type: GraphQLBoolean, resolve: prop('active') },
    alternateCaptain: { type: GraphQLBoolean, resolve: prop('alternateCaptain') },
    captain: { type: GraphQLBoolean, resolve: prop('captain') },
    rookie: { type: GraphQLBoolean, resolve: prop('rookie') },
    shootsCatches: { type: GraphQLString, resolve: prop('shootsCatches') },
    rosterStatus: { type: GraphQLString, resolve: prop('rosterStatus') },
    primaryPosition: { type: Position, resolve: prop('primaryPosition') },
    // Lazy load current team info
    currentTeamInfo: { type: TeamInfo, resolve: p => fetchInfoForTeamId(p.currentTeam.id) },
    // Lazy load draft info
    draftInfo: { type: DraftInfo, resolve: p => fetchDraftInfoForPlayer(p.fullName) },
  },
});

/* Game Log
{
  "timeOnIce" : "23:10",
  "assists" : 0,
  "goals" : 0,
  "pim" : 2,
  "shots" : 2,
  "games" : 1,
  "hits" : 0,
  "powerPlayGoals" : 0,
  "powerPlayPoints" : 0,
  "powerPlayTimeOnIce" : "07:06",
  "evenTimeOnIce" : "16:04",
  "penaltyMinutes" : "2",
  "shotPct" : 0.0,
  "gameWinningGoals" : 0,
  "overTimeGoals" : 0,
  "shortHandedGoals" : 0,
  "shortHandedPoints" : 0,
  "shortHandedTimeOnIce" : "00:00",
  "blocked" : 0,
  "plusMinus" : -2,
  "points" : 0,
  "shifts" : 26
},
"team" : {
  "id" : 21,
  "name" : "Colorado Avalanche",
  "link" : "/api/v1/teams/21"
},
"opponent" : {
  "id" : 2,
  "name" : "New York Islanders",
  "link" : "/api/v1/teams/2"
},
"date" : "2018-12-17",
"isHome" : true,
"isWin" : false,
"isOT" : false,
"game" : {
  "gamePk" : 2018020516,
  "link" : "/api/v1/game/2018020516/feed/live",
  "content" : {
    "link" : "/api/v1/game/2018020516/content"
  }
}
*/

const GameLog = new GraphQLObjectType({
  name: 'GameLog',
  fields: {
    timeOnIce: { type: GraphQLString, resolve: prop('timeOnIce') },
    assists: { type: GraphQLInt, resolve: prop('assists') },
    goals: { type: GraphQLInt, resolve: prop('goals') },
    pim: { type: GraphQLInt, resolve: prop('pim') },
    shots: { type: GraphQLInt, resolve: prop('shots') },
    games: { type: GraphQLInt, resolve: prop('games') },
    hits: { type: GraphQLInt, resolve: prop('hits') },
    powerPlayGoals: { type: GraphQLInt, resolve: prop('powerPlayGoals') },
    powerPlayPoints: { type: GraphQLInt, resolve: prop('powerPlayPoints') },
    powerPlayTimeOnIce: { type: GraphQLString, resolve: prop('powerPlayTimeOnIce') },
    evenTimeOnIce: { type: GraphQLString, resolve: prop('evenTimeOnIce') },
    penaltyMinutes: { type: GraphQLInt, resolve: prop('penaltyMinutes') },
    shotPct: { type: GraphQLFloat, resolve: prop('shotPct') },
    gameWinningGoals: { type: GraphQLInt, resolve: prop('gameWinningGoals') },
    overTimeGoals: { type: GraphQLInt, resolve: prop('overTimeGoals') },
    shortHandedGoals: { type: GraphQLInt, resolve: prop('shortHandedGoals') },
    shortHandedPoints: { type: GraphQLInt, resolve: prop('shortHandedPoints') },
    shortHandedTimeOnIce: { type: GraphQLString, resolve: prop('shortHandedTimeOnIce') },
    blocked: { type: GraphQLInt, resolve: prop('blocked') },
    plusMinus: { type: GraphQLInt, resolve: prop('plusMinus') },
    points: { type: GraphQLInt, resolve: prop('points') },
    shifts: { type: GraphQLInt, resolve: prop('shifts') },
    team: { type: TeamInfo, resolve: prop('team') },
    opponent: { type: TeamInfo, resolve: prop('opponent') },
    date: { type: GraphQLString, resolve: prop('date') },
    isHome: { type: GraphQLBoolean, resolve: prop('isHome') },
    isWin: { type: GraphQLBoolean, resolve: prop('isWin') },
    isOT: { type: GraphQLBoolean, resolve: prop('isOT') },
  },
});


/* Player Stats
{
  "teamId": 1,
  "stats": [
    {
      "season": "20182019",
      "stat": {
        "timeOnIce": "247:46",
        "assists": 3,
        "goals": 2,
        "pim": 16,
        "shots": 28,
        "games": 20,
        "hits": 43,
        "powerPlayGoals": 0,
        "powerPlayPoints": 0,
        "powerPlayTimeOnIce": "24:27",
        "evenTimeOnIce": "222:38",
        "penaltyMinutes": "16",
        "faceOffPct": 41.46,
        "shotPct": 7.1,
        "gameWinningGoals": 0,
        "overTimeGoals": 0,
        "shortHandedGoals": 0,
        "shortHandedPoints": 0,
        "shortHandedTimeOnIce": "00:41",
        "blocked": 12,
        "plusMinus": -4,
        "points": 5,
        "shifts": 329,
        "timeOnIcePerGame": "12:23",
        "evenTimeOnIcePerGame": "11:07",
        "shortHandedTimeOnIcePerGame": "00:02",
        "powerPlayTimeOnIcePerGame": "01:13"
      }
    }
  ],
  "id": 8476474,
  "person": {
    "id": 8476474,
    "fullName": "Stefan Noesen",
    "link": "/api/v1/people/8476474"
  },
  "jerseyNumber": "23",
  "position": {
    "code": "R",
    "name": "Right Wing",
    "type": "Forward",
    "abbreviation": "RW"
  }
},
*/

const SeasonStat = new GraphQLObjectType({
  name: 'SeasonStat',
  fields: {
    timeOnIce: {
      type: GraphQLString,
      resolve: prop('timeOnIce'),
    },
    powerPlayTimeOnIce: {
      type: GraphQLString,
      resolve: prop('powerPlayTimeOnIce'),
    },
    evenTimeOnIce: {
      type: GraphQLString,
      resolve: prop('evenTimeOnIce'),
    },
    penaltyMinutes: {
      type: GraphQLString,
      resolve: prop('penaltyMinutes'),
    },
    shortHandedTimeOnIce: {
      type: GraphQLString,
      resolve: prop('shortHandedTimeOnIce'),
    },
    timeOnIcePerGame: {
      type: GraphQLString,
      resolve: prop('timeOnIcePerGame'),
    },
    evenTimeOnIcePerGame: {
      type: GraphQLString,
      resolve: prop('evenTimeOnIcePerGame'),
    },
    shortHandedTimeOnIcePerGame: {
      type: GraphQLString,
      resolve: prop('shortHandedTimeOnIcePerGame'),
    },
    powerPlayTimeOnIcePerGame: {
      type: GraphQLString,
      resolve: prop('powerPlayTimeOnIcePerGame'),
    },
    assists: {
      type: GraphQLInt,
      resolve: prop('assists'),
    },
    goals: {
      type: GraphQLInt,
      resolve: prop('goals'),
    },
    pim: {
      type: GraphQLInt,
      resolve: prop('pim'),
    },
    shots: {
      type: GraphQLInt,
      resolve: prop('shots'),
    },
    games: {
      type: GraphQLInt,
      resolve: prop('games'),
    },
    hits: {
      type: GraphQLInt,
      resolve: prop('hits'),
    },
    powerPlayGoals: {
      type: GraphQLInt,
      resolve: prop('powerPlayGoals'),
    },
    powerPlayPoints: {
      type: GraphQLInt,
      resolve: prop('powerPlayPoints'),
    },
    faceOffPct: {
      type: GraphQLFloat,
      resolve: prop('faceOffPct'),
    },
    shotPct: {
      type: GraphQLFloat,
      resolve: prop('shotPct'),
    },
    gameWinningGoals: {
      type: GraphQLInt,
      resolve: prop('gameWinningGoals'),
    },
    overTimeGoals: {
      type: GraphQLInt,
      resolve: prop('overTimeGoals'),
    },
    shortHandedGoals: {
      type: GraphQLInt,
      resolve: prop('shortHandedGoals'),
    },
    shortHandedPoints: {
      type: GraphQLInt,
      resolve: prop('shortHandedPoints'),
    },
    blocked: {
      type: GraphQLInt,
      resolve: prop('blocked'),
    },
    plusMinus: {
      type: GraphQLInt,
      resolve: prop('plusMinus'),
    },
    points: {
      type: GraphQLInt,
      resolve: prop('points'),
    },
    shifts: {
      type: GraphQLInt,
      resolve: prop('shifts'),
    },
  },
});

const Stat = new GraphQLObjectType({
  name: 'Stat',
  fields: {
    season: { type: GraphQLString, resolve: prop('season') },
    stat: { type: SeasonStat, resolve: prop('stat') },
    league: { type: LeagueInfo, resolve: prop('league') },
    team: { type: TeamInfo, resolve: prop('team') },
    opponent: { type: TeamInfo, resolve: prop('opponent') },
    date: { type: GraphQLString, resolve: prop('date') },
    isHome: { type: GraphQLBoolean, resolve: prop('isHome') },
    isWin: { type: GraphQLBoolean, resolve: prop('isWin') },
    isOT: { type: GraphQLBoolean, resolve: prop('isOT') },
  },
});

const Person = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    link: { type: GraphQLString, resolve: prop('link') },
    fullName: { type: GraphQLString, resolve: prop('fullName') },
  },
});

const Player = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: prop('id'),
    },
    // Lazy load team info
    team: {
      type: TeamInfo,
      resolve: p => fetchInfoForTeamId(p.teamId),
    },
    jerseyNumber: {
      type: GraphQLInt,
      resolve: pipe(prop('jerseyNumber'), Number),
    },
    person: {
      type: Person,
      resolve: prop('person'),
    },
    position: {
      type: Position,
      resolve: prop('position'),
    },
    // Lazy load player info
    info: {
      type: PlayerInfo,
      resolve: p => fetchInfoForPlayerId(p.id),
    },
    // Lazy load player stats
    stats: {
      type: new GraphQLList(Stat),
      resolve: p => fetchStatsForPlayerId(p.id),
    },
  },
});

const PlayerDetails = new GraphQLObjectType({
  name: 'PlayerDetails',
  fields: {
    // Lazy load player info
    info: {
      type: PlayerInfo,
      resolve: p => fetchInfoForPlayerId(p.id),
    },
    // Lazy load player stats
    stats: {
      type: new GraphQLList(Stat),
      resolve: p => fetchAllYearsStatsForPlayerId(p.id),
    },
    // Lazy load game logs
    logs: {
      type: new GraphQLList(Stat),
      resolve: p => fetchCurrentSeasonGameLogsForPlayerId(p.id),
    },
  },
});

const GameStatus = new GraphQLObjectType({
  name: 'GameStatus',
  fields: {
    abstractGameState: {
      type: GraphQLString,
      resolve: prop('abstractGameState'),
    },
    codedGameState: {
      type: GraphQLString,
      resolve: prop('codedGameState'),
    },
    detailedState: {
      type: GraphQLString,
      resolve: prop('detailedState'),
    },
    statusCode: {
      type: GraphQLString,
      resolve: prop('statusCode'),
    },
  },
});

const MatchupTeam = new GraphQLObjectType({
  name: 'MatchupTeam',
  fields: {
    leagueRecord: { type: Record, resolve: prop('leagueRecord') },
    score: { type: GraphQLInt, resolve: prop('score') },
    team: { type: TeamInfo, resolve: o => fetchInfoForTeamId(o.team.id) },
  },
});

const Matchup = new GraphQLObjectType({
  name: 'Matchup',
  fields: {
    away: { type: MatchupTeam, resolve: prop('away') },
    home: { type: MatchupTeam, resolve: prop('home') },
  },
});

const Game = new GraphQLObjectType({
  name: 'Game',
  fields: {
    gamePk: { type: GraphQLInt, resolve: prop('gamePk') },
    link: { type: GraphQLString, resolve: prop('link') },
    gameType: { type: GraphQLString, resolve: prop('gameType') },
    season: { type: GraphQLString, resolve: prop('season') },
    gameDate: { type: GraphQLString, resolve: prop('gameDate') },
    status: { type: GameStatus, resolve: prop('status') },
    teams: { type: Matchup, resolve: prop('teams') },
    // venue: {},
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      players: {
        type: new GraphQLList(Player),
        resolve: fetchAllPlayers,
      },
      player: {
        type: PlayerDetails,
        args: { id: { type: GraphQLInt } },
        resolve: (root, args) => ({
          id: args.id,
        }),
      },
      standings: {
        type: GraphQLList(StandingsRecord),
        resolve: fetchStandings,
      },
      games: {
        args: {
          startDate: { type: GraphQLString },
          date: { type: GraphQLString },
          endDate: { type: GraphQLString },
        },
        type: GraphQLList(Game),
        resolve: (root, args) => fetchGames(args),
      },
    },
  }),
});

module.exports = schema;
