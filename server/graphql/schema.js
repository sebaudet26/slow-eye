const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');
const {
  pipe, prop,
} = require('ramda');
const {
  fetchStatsForPlayerId,
  fetchInfoForTeamId,
  fetchAllPlayers,
} = require('../libs/nhlApi');


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
    id: {
      type: GraphQLInt,
      resolve: prop('id'),
    },
    name: {
      type: GraphQLString,
      resolve: prop('name'),
    },
    link: {
      type: GraphQLString,
      resolve: prop('link'),
    },
    abbreviation: {
      type: GraphQLString,
      resolve: prop('abbreviation'),
    },
    teamName: {
      type: GraphQLString,
      resolve: prop('teamName'),
    },
    locationName: {
      type: GraphQLString,
      resolve: prop('locationName'),
    },
    shortName: {
      type: GraphQLString,
      resolve: prop('shortName'),
    },
    officialSiteUrl: {
      type: GraphQLString,
      resolve: prop('officialSiteUrl'),
    },
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
    season: {
      type: GraphQLString,
      resolve: prop('season'),
    },
    stat: {
      type: SeasonStat,
      resolve: prop('stat'),
    },
  },
});

const Person = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: prop('id'),
    },
    link: {
      type: GraphQLString,
      resolve: prop('link'),
    },
    fullName: {
      type: GraphQLString,
      resolve: prop('fullName'),
    },
  },
});

const Position = new GraphQLObjectType({
  name: 'Position',
  fields: {
    code: {
      type: GraphQLString,
      resolve: prop('code'),
    },
    name: {
      type: GraphQLString,
      resolve: prop('name'),
    },
    type: {
      type: GraphQLString,
      resolve: prop('type'),
    },
    abbreviation: {
      type: GraphQLString,
      resolve: prop('abbreviation'),
    },
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
    // Lazy load player stats
    stats: {
      type: new GraphQLList(Stat),
      resolve: p => fetchStatsForPlayerId(p.id),
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      players: {
        type: new GraphQLList(Player),
        resolve() {
          return fetchAllPlayers();
        },
      },
    },
  }),
});

module.exports = schema;