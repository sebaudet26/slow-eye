const {
  flatten, map, mergeAll, path, pipe, prop,
} = require('ramda');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql');
const fetch = require('node-fetch');

const nhlApiUrl = 'https://statsapi.web.nhl.com/api/v1';

const cache = {};

const nhlAPI = async (resource) => {
  if (cache[resource]) {
    return cache[resource];
  }
  const url = `${nhlApiUrl}${resource}`;
  const response = await fetch(url);
  const data = await response.json();
  cache[resource] = data;
  return data;
};

const fetchStatsForPlayerId = async (playerId) => {
  const resource = `/people/${playerId}/stats?stats=statsSingleSeason`;
  const playerStatsData = await nhlAPI(resource);
  return { [playerId]: path(['stats', 0, 'splits'], playerStatsData) };
};

const fetchPlayersForTeamId = async (teamId) => {
  const resource = `/teams/${teamId}/roster`;
  const json = await nhlAPI(resource);
  const allRosterIds = map(path(['person', 'id']), json.roster);
  const playerInfo = mergeAll(json.roster.map(p => ({ [p.person.id]: { ...p } })));
  const playerStats = await Promise.all(map(fetchStatsForPlayerId, allRosterIds));
  const statsObject = mergeAll(playerStats);
  const fullData = allRosterIds.map(id => ({
    teamId, stats: statsObject[id], id, ...playerInfo[id],
  }));
  return fullData;
};

const fetchAllTeams = async () => {
  const resource = '/teams';
  const allTeamsData = await nhlAPI(resource);
  return allTeamsData;
};

const fetchAllTeamsPlayers = async () => {
  const allTeamsData = await fetchAllTeams();
  const allTeamsIds = map(prop('id'), prop('teams', allTeamsData));
  const allTeamsRosters = await Promise.all(map(fetchPlayersForTeamId, [1]));
  return flatten(allTeamsRosters);
};

/*
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
      type: GraphQLInt,
      resolve: prop('faceOffPct'),
    },
    shotPct: {
      type: GraphQLInt,
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
    teamId: {
      type: GraphQLInt,
      resolve: prop('teamId'),
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
    stats: {
      type: new GraphQLList(Stat),
      resolve: prop('stats'),
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
          return fetchAllTeamsPlayers();
        },
      },
    },
  }),
});

module.exports = schema;
