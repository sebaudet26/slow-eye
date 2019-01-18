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
  pipe, prop, path, map, values,
} = require('ramda');
const {
  fetchStandings,
  fetchStatsForPlayerId,
  fetchCurrentSeasonGameLogsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchInfoForPlayerId,
  fetchStatsForTeamId,
  fetchInfoForTeamId,
  fetchDraftInfoForPlayer,
  fetchPlayersForTeamId,
  fetchAllPlayers,
  fetchAllTeams,
  fetchGames,
  fetchBoxscore,
} = require('../libs/nhlApi');

const ifNotThereFetchId = propName => async (d) => {
  if (d.id) {
    const data = await fetchInfoForTeamId(d.id);
    return prop(propName, data);
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

const LeagueInfo = new GraphQLObjectType({
  name: 'LeagueInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    link: { type: GraphQLString, resolve: prop('link') },
  },
});

const Venue = new GraphQLObjectType({
  name: 'Venue',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    link: { type: GraphQLString, resolve: prop('link') },
    city: { type: GraphQLString, resolve: prop('city') },
  },
});

const TeamStat = new GraphQLObjectType({
  name: 'TeamStat',
  fields: {
    gamesPlayed: { type: GraphQLString, resolve: pipe(prop('gamesPlayed'), String) },
    wins: { type: GraphQLString, resolve: pipe(prop('wins'), String) },
    losses: { type: GraphQLString, resolve: pipe(prop('losses'), String) },
    ot: { type: GraphQLString, resolve: pipe(prop('ot'), String) },
    pts: { type: GraphQLString, resolve: pipe(prop('pts'), String) },
    ptPctg: { type: GraphQLString, resolve: pipe(prop('ptPctg'), String) },
    goalsPerGame: { type: GraphQLString, resolve: pipe(prop('goalsPerGame'), String) },
    goalsAgainstPerGame: { type: GraphQLString, resolve: pipe(prop('goalsAgainstPerGame'), String) },
    evGGARatio: { type: GraphQLString, resolve: pipe(prop('evGGARatio'), String) },
    powerPlayPercentage: { type: GraphQLString, resolve: pipe(prop('powerPlayPercentage'), String) },
    powerPlayGoals: { type: GraphQLString, resolve: pipe(prop('powerPlayGoals'), String) },
    powerPlayGoalsAgainst: { type: GraphQLString, resolve: pipe(prop('powerPlayGoalsAgainst'), String) },
    powerPlayOpportunities: { type: GraphQLString, resolve: pipe(prop('powerPlayOpportunities'), String) },
    penaltyKillPercentage: { type: GraphQLString, resolve: pipe(prop('penaltyKillPercentage'), String) },
    shotsPerGame: { type: GraphQLString, resolve: pipe(prop('shotsPerGame'), String) },
    shotsAllowed: { type: GraphQLString, resolve: pipe(prop('shotsAllowed'), String) },
    winScoreFirst: { type: GraphQLString, resolve: pipe(prop('winScoreFirst'), String) },
    winOppScoreFirst: { type: GraphQLString, resolve: pipe(prop('winOppScoreFirst'), String) },
    winLeadFirstPer: { type: GraphQLString, resolve: pipe(prop('winLeadFirstPer'), String) },
    winLeadSecondPer: { type: GraphQLString, resolve: pipe(prop('winLeadSecondPer'), String) },
    winOutshootOpp: { type: GraphQLString, resolve: pipe(prop('winOutshootOpp'), String) },
    winOutshotByOpp: { type: GraphQLString, resolve: pipe(prop('winOutshotByOpp'), String) },
    faceOffsTaken: { type: GraphQLString, resolve: pipe(prop('faceOffsTaken'), String) },
    faceOffsWon: { type: GraphQLString, resolve: pipe(prop('faceOffsWon'), String) },
    faceOffsLost: { type: GraphQLString, resolve: pipe(prop('faceOffsLost'), String) },
    faceOffWinPercentage: { type: GraphQLString, resolve: pipe(prop('faceOffWinPercentage'), String) },
    shootingPctg: { type: GraphQLString, resolve: pipe(prop('shootingPctg'), String) },
    savePctg: { type: GraphQLString, resolve: pipe(prop('savePctg'), String) },
  },
});

const TeamStats = new GraphQLObjectType({
  name: 'TeamStats',
  fields: {
    type: { type: GraphQLString, resolve: path(['type', 'displayName']) },
    splits: { type: GraphQLList(TeamStat), resolve: pipe(prop('splits'), map(prop('stat'))) },
  },
});

const TeamRosterPlayer = new GraphQLObjectType({
  name: 'TeamRosterPlayer',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
  },
});

const TeamInfo = new GraphQLObjectType({
  name: 'TeamInfo',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: ifNotThereFetchId('name') },
    link: { type: GraphQLString, resolve: ifNotThereFetchId('link') },
    abbreviation: { type: GraphQLString, resolve: ifNotThereFetchId('abbreviation') },
    teamName: { type: GraphQLString, resolve: ifNotThereFetchId('teamName') },
    locationName: { type: GraphQLString, resolve: ifNotThereFetchId('locationName') },
    venue: { type: Venue, resolve: ifNotThereFetchId('venue') },
    shortName: { type: GraphQLString, resolve: ifNotThereFetchId('shortName') },
    officialSiteUrl: { type: GraphQLString, resolve: ifNotThereFetchId('officialSiteUrl') },
    stats: { type: TeamStats, resolve: p => fetchStatsForTeamId(p.id) },
    roster: { type: GraphQLList(TeamRosterPlayer), resolve: p => fetchPlayersForTeamId(p.id) },
  },
});

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
    id: { type: GraphQLInt, resolve: prop('id') },
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

const Stat = new GraphQLObjectType({
  name: 'Stat',
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
    ot: {
      type: GraphQLInt,
      resolve: prop('ot'),
    },
    shutouts: {
      type: GraphQLInt,
      resolve: prop('shutouts'),
    },
    ties: {
      type: GraphQLInt,
      resolve: prop('ties'),
    },
    wins: {
      type: GraphQLInt,
      resolve: prop('wins'),
    },
    losses: {
      type: GraphQLInt,
      resolve: prop('losses'),
    },
    saves: {
      type: GraphQLInt,
      resolve: prop('saves'),
    },
    powerPlaySaves: {
      type: GraphQLInt,
      resolve: prop('powerPlaySaves'),
    },
    shortHandedSaves: {
      type: GraphQLInt,
      resolve: prop('shortHandedSaves'),
    },
    evenSaves: {
      type: GraphQLInt,
      resolve: prop('evenSaves'),
    },
    shortHandedShots: {
      type: GraphQLInt,
      resolve: prop('shortHandedShots'),
    },
    evenShots: {
      type: GraphQLInt,
      resolve: prop('evenShots'),
    },
    powerPlayShots: {
      type: GraphQLInt,
      resolve: prop('powerPlayShots'),
    },
    savePercentage: {
      type: GraphQLFloat,
      resolve: prop('savePercentage'),
    },
    goalAgainstAverage: {
      type: GraphQLFloat,
      resolve: prop('goalAgainstAverage'),
    },
    gamesStarted: {
      type: GraphQLInt,
      resolve: prop('gamesStarted'),
    },
    shotsAgainst: {
      type: GraphQLInt,
      resolve: prop('shotsAgainst'),
    },
    goalsAgainst: {
      type: GraphQLInt,
      resolve: prop('goalsAgainst'),
    },
    powerPlaySavePercentage: {
      type: GraphQLFloat,
      resolve: prop('powerPlaySavePercentage'),
    },
    shortHandedSavePercentage: {
      type: GraphQLFloat,
      resolve: prop('shortHandedSavePercentage'),
    },
    evenStrengthSavePercentage: {
      type: GraphQLFloat,
      resolve: prop('evenStrengthSavePercentage'),
    },
    takeaways: {
      type: GraphQLInt,
      resolve: prop('takeaways'),
    },
    giveaways: {
      type: GraphQLInt,
      resolve: prop('giveaways'),
    },
    faceOffWins: {
      type: GraphQLInt,
      resolve: prop('faceOffWins'),
    },
    faceOffTaken: {
      type: GraphQLInt,
      resolve: prop('faceoffTaken'),
    },
  },
});

const SeasonStat = new GraphQLObjectType({
  name: 'SeasonStat',
  fields: {
    season: { type: GraphQLString, resolve: prop('season') },
    stat: { type: Stat, resolve: prop('stat') },
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
    id: { type: GraphQLInt, resolve: prop('id') },
    person: { type: Person, resolve: prop('person') },
    jerseyNumber: {
      type: GraphQLInt,
      resolve: pipe(prop('jerseyNumber'), Number),
    },
    position: {
      type: Position,
      resolve: prop('position'),
    },
    // Lazy load team info
    team: {
      type: TeamInfo,
      resolve: p => p.team || fetchInfoForTeamId(p.teamId),
    },
    // Lazy load player info
    info: {
      type: PlayerInfo,
      resolve: p => fetchInfoForPlayerId(p.id),
    },
    // Lazy load player stats
    stats: {
      args: {
        season: { type: GraphQLString },
      },
      type: new GraphQLList(SeasonStat),
      resolve: (p, args) => fetchStatsForPlayerId(p.id, args),
    },
    // Lazy load player stats
    careerStats: {
      type: new GraphQLList(SeasonStat),
      resolve: p => fetchAllYearsStatsForPlayerId(p.id),
    },
    // Lazy load player stats
    boxscore: {
      args: {
        season: { type: GraphQLString },
      },
      type: Stat,
      resolve: p => p.stats.skaterStats || p.stats.goalieStats,
    },
    // Lazy load game logs
    logs: {
      type: new GraphQLList(SeasonStat),
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

const GameTeamStat = new GraphQLObjectType({
  name: 'GameTeamStat',
  fields: {
    goals: { type: GraphQLInt, resolve: prop('goals') },
    pim: { type: GraphQLInt, resolve: prop('pim') },
    shots: { type: GraphQLInt, resolve: prop('shots') },
    powerPlayPercentage: { type: GraphQLFloat, resolve: pipe(prop('powerPlayPercentage'), Number) },
    powerPlayGoals: { type: GraphQLFloat, resolve: prop('powerPlayGoals') },
    powerPlayOpportunities: { type: GraphQLFloat, resolve: prop('powerPlayOpportunities') },
    faceOffWinPercentage: { type: GraphQLFloat, resolve: pipe(prop('faceOffWinPercentage'), Number) },
    blocked: { type: GraphQLInt, resolve: prop('blocked') },
    takeaways: { type: GraphQLInt, resolve: prop('takeaways') },
    giveaways: { type: GraphQLInt, resolve: prop('giveaways') },
    hits: { type: GraphQLInt, resolve: prop('hits') },
  },
});

const TeamBoxscore = new GraphQLObjectType({
  name: 'TeamBoxscore',
  fields: {
    team: { type: TeamInfo, resolve: prop('team') },
    teamStats: { type: GameTeamStat, resolve: path(['teamStats', 'teamSkaterStats']) },
    players: { type: GraphQLList(Player), resolve: pipe(prop('players'), values) },
  },
});

const Boxscore = new GraphQLObjectType({
  name: 'Boxscore',
  fields: {
    id: { type: GraphQLString, resolve: prop('id') },
    away: { type: TeamBoxscore, resolve: prop('away') },
    home: { type: TeamBoxscore, resolve: prop('home') },
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
        args: { season: { type: GraphQLString } },
        type: new GraphQLList(Player),
        resolve: fetchAllPlayers,
      },
      player: {
        type: Player,
        args: { id: { type: GraphQLInt } },
        resolve: (root, args) => ({
          id: args.id,
        }),
      },
      standings: {
        type: GraphQLList(StandingsRecord),
        resolve: fetchStandings,
      },
      teams: {
        type: GraphQLList(TeamInfo),
        resolve: fetchAllTeams,
      },
      team: {
        type: TeamInfo,
        args: { id: { type: GraphQLInt } },
        resolve: (root, agrs) => ({
          id: agrs.id,
        }),
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
      game: {
        args: {
          id: { type: GraphQLString },
        },
        type: Boxscore,
        resolve: (root, args) => fetchBoxscore(args.id),
      },
    },
  }),
});

module.exports = schema;
