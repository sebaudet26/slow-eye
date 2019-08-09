const {
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');
const _ = require('lodash');
const {
  equals,
  head,
  filter,
  find,
  join,
  lte,
  map,
  path,
  pathOr,
  pipe,
  pick,
  prop,
  propEq,
  propOr,
  replace,
  split,
  sum,
  take,
  takeLast,
  values,
} = require('ramda');
const TEAMS = require('../libs/teams');
const {
  fetchStandings,
  fetchStatsForPlayerId,
  fetchGameLogsForPlayerId,
  fetchAllYearsStatsForPlayerId,
  fetchInfoForPlayerId,
  fetchStatsForTeamId,
  fetchInfoForTeamId,
  fetchDraftInfoForPlayer,
  fetchDraft,
  fetchPlayersForTeamId,
  fetchAllPlayers,
  fetchAllHistoryPlayers,
  fetchAllTeams,
  fetchGames,
  fetchBoxscore,
  fetchTeamRanking,
  fetchLiveFeed,
  fetchAllYearsPlayoffStatsForPlayerId,
  fetchPlayoffGameLogsForPlayerId,
  fetchPlayersReport,
  fetchGameHighlights,
  calculatePlayerStreaks,
  calculateTeamsStreaks,
} = require('../libs/nhlApi');

const {
  isHot,
  isCold,
  hotColdPoints,
  hotColdGames,
  hotColdPlusMinus,
} = require('./streaks');

const {
  getFinalPeriod,
  getStatusText,
} = require('./nhlGames');

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
    splits: {
      type: GraphQLList(TeamStat), resolve: pipe(
        prop('splits'),
        map(prop('stat')),
      )
    },
    record: {
      type: GraphQLString,
      resolve: pipe(
        prop('splits'),
        map(prop('stat')),
        head,
        pick(['wins', 'losses', 'ot']),
        values,
        join('-'),
      )
    },
  },
});

const TeamRanking = new GraphQLObjectType({
  name: 'TeamRanking',
  fields: {
    conference: { type: GraphQLInt, resolve: prop('conference') },
    conferenceName: { type: GraphQLString, resolve: prop('conferenceName') },
    division: { type: GraphQLInt, resolve: prop('division') },
    divisionName: { type: GraphQLString, resolve: prop('divisionName') },
    league: { type: GraphQLInt, resolve: prop('league') },
  },
});

const TeamInfo = new GraphQLObjectType({
  name: 'TeamInfo',
  fields: () => ({
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: ifNotThereFetchId('name') },
    link: { type: GraphQLString, resolve: ifNotThereFetchId('link') },
    triCode: { type: GraphQLString, resolve: prop('triCode') },
    abbreviation: { type: GraphQLString, resolve: ifNotThereFetchId('abbreviation') },
    teamName: { type: GraphQLString, resolve: ifNotThereFetchId('teamName') },
    locationName: { type: GraphQLString, resolve: ifNotThereFetchId('locationName') },
    venue: { type: Venue, resolve: ifNotThereFetchId('venue') },
    shortName: { type: GraphQLString, resolve: ifNotThereFetchId('shortName') },
    officialSiteUrl: { type: GraphQLString, resolve: ifNotThereFetchId('officialSiteUrl') },
    stats: { type: TeamStats, resolve: p => fetchStatsForTeamId(p.id) },
    roster: {
      type: GraphQLList(Player),
      resolve: p => fetchPlayersForTeamId(p.id),
    },
    ranking: { type: TeamRanking, resolve: p => fetchTeamRanking(p.id) },
  }),
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

const DraftPick = new GraphQLObjectType({
  name: 'DraftPick',
  fields: {
    prospectId: { type: GraphQLString, resolve: prop('id') },
    amateurClubName: { type: GraphQLString, resolve: prop('amateurClubName') },
    amateurLeague: { type: GraphQLString, resolve: prop('amateurLeague') },
    birthDate: { type: GraphQLString, resolve: prop('birthDate') },
    birthPlace: { type: GraphQLString, resolve: prop('birthPlace') },
    countryCode: { type: GraphQLString, resolve: prop('countryCode') },
    csPlayerId: { type: GraphQLInt, resolve: prop('csPlayerId') },
    year: { type: GraphQLInt, resolve: prop('draftYear') },
    teamId: { type: GraphQLInt, resolve: prop('draftedByTeamId') },
    firstName: { type: GraphQLString, resolve: prop('firstName') },
    height: { type: GraphQLInt, resolve: prop('height') },
    lastName: { type: GraphQLString, resolve: prop('lastName') },
    overallNumber: { type: GraphQLInt, resolve: prop('overallPickNumber') },
    inRoundNumber: { type: GraphQLInt, resolve: prop('pickInRound') },
    id: { type: GraphQLInt, resolve: prop('playerId') },
    name: { type: GraphQLString, resolve: prop('playerName') },
    position: { type: GraphQLString, resolve: prop('position') },
    removedOutright: { type: GraphQLString, resolve: prop('removedOutright') },
    removedOutrightWhy: { type: GraphQLString, resolve: prop('removedOutrightWhy') },
    round: { type: GraphQLInt, resolve: prop('roundNumber') },
    shootsCatches: { type: GraphQLString, resolve: prop('shootsCatches') },
    supplementalDraft: { type: GraphQLString, resolve: prop('supplementalDraft') },
    pickedBy: {
      type: TeamInfo,
      resolve: pipe(
        prop('triCode'),
        teamAbr => find(propEq('abbreviation', teamAbr))(TEAMS),
      ),
    },
    triCode: { type: GraphQLString, resolve: prop('triCode') },
    weight: { type: GraphQLInt, resolve: prop('weight') },
  },
});

const DraftInfo = new GraphQLObjectType({
  name: 'DraftInfo',
  fields: {
    year: { type: GraphQLInt, resolve: prop('draftYear') },
    round: { type: GraphQLInt, resolve: prop('roundNumber') },
    pickOverall: { type: GraphQLInt, resolve: prop('overallPickNumber') },
    pickInRound: { type: GraphQLInt, resolve: prop('pickInRound') },
    team: { type: TeamInfo, resolve: p => fetchInfoForTeamId(p.draftedByTeamId) },
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
    alternateCaptain: { type: GraphQLBoolean, resolve: prop('alternateCaptain') },
    captain: { type: GraphQLBoolean, resolve: prop('captain') },
    shootsCatches: { type: GraphQLString, resolve: prop('shootsCatches') },
    rosterStatus: { type: GraphQLString, resolve: prop('rosterStatus') },
    primaryPosition: { type: Position, resolve: prop('primaryPosition') },
    // Lazy load current team info
    currentTeamInfo: { type: TeamInfo, resolve: p => fetchInfoForTeamId(p.currentTeam.id) },
    // Lazy load draft info
    draftInfo: { type: DraftInfo, resolve: p => fetchDraftInfoForPlayer(p.id) },
  },
});

const Stat = new GraphQLObjectType({
  name: 'Stat',
  fields: {
    timeOnIce: { type: GraphQLString, resolve: prop('timeOnIce') },
    powerPlayTimeOnIce: { type: GraphQLString, resolve: prop('powerPlayTimeOnIce') },
    evenTimeOnIce: { type: GraphQLString, resolve: prop('evenTimeOnIce') },
    penaltyMinutes: { type: GraphQLString, resolve: prop('penaltyMinutes') },
    shortHandedTimeOnIce: { type: GraphQLString, resolve: prop('shortHandedTimeOnIce') },
    timeOnIcePerGame: { type: GraphQLString, resolve: prop('timeOnIcePerGame') },
    evenTimeOnIcePerGame: { type: GraphQLString, resolve: prop('evenTimeOnIcePerGame') },
    shortHandedTimeOnIcePerGame: { type: GraphQLString, resolve: prop('shortHandedTimeOnIcePerGame') },
    powerPlayTimeOnIcePerGame: { type: GraphQLString, resolve: prop('powerPlayTimeOnIcePerGame') },
    assists: { type: GraphQLInt, resolve: prop('assists') },
    goals: { type: GraphQLInt, resolve: prop('goals') },
    pim: { type: GraphQLInt, resolve: prop('pim') },
    shots: { type: GraphQLInt, resolve: prop('shots') },
    games: { type: GraphQLInt, resolve: prop('games') },
    hits: { type: GraphQLInt, resolve: prop('hits') },
    powerPlayGoals: { type: GraphQLInt, resolve: prop('powerPlayGoals') },
    powerPlayPoints: { type: GraphQLInt, resolve: prop('powerPlayPoints') },
    faceOffPct: { type: GraphQLFloat, resolve: prop('faceOffPct') },
    shotPct: { type: GraphQLFloat, resolve: prop('shotPct') },
    gameWinningGoals: { type: GraphQLInt, resolve: prop('gameWinningGoals') },
    overTimeGoals: { type: GraphQLInt, resolve: prop('overTimeGoals') },
    shortHandedGoals: { type: GraphQLInt, resolve: prop('shortHandedGoals') },
    shortHandedPoints: { type: GraphQLInt, resolve: prop('shortHandedPoints') },
    blocked: { type: GraphQLInt, resolve: prop('blocked') },
    plusMinus: { type: GraphQLInt, resolve: prop('plusMinus') },
    points: { type: GraphQLInt, resolve: prop('points') },
    shifts: { type: GraphQLInt, resolve: prop('shifts') },
    ot: { type: GraphQLInt, resolve: prop('ot') },
    shutouts: { type: GraphQLInt, resolve: prop('shutouts') },
    ties: { type: GraphQLInt, resolve: prop('ties') },
    wins: { type: GraphQLInt, resolve: prop('wins') },
    losses: { type: GraphQLInt, resolve: prop('losses') },
    saves: { type: GraphQLInt, resolve: prop('saves') },
    powerPlaySaves: { type: GraphQLInt, resolve: prop('powerPlaySaves') },
    shortHandedSaves: { type: GraphQLInt, resolve: prop('shortHandedSaves') },
    evenSaves: { type: GraphQLInt, resolve: prop('evenSaves') },
    shortHandedShots: { type: GraphQLInt, resolve: prop('shortHandedShots') },
    evenShots: { type: GraphQLInt, resolve: prop('evenShots') },
    powerPlayShots: { type: GraphQLInt, resolve: prop('powerPlayShots') },
    savePercentage: { type: GraphQLFloat, resolve: prop('savePercentage') },
    goalAgainstAverage: { type: GraphQLFloat, resolve: prop('goalAgainstAverage') },
    gamesStarted: { type: GraphQLInt, resolve: prop('gamesStarted') },
    shotsAgainst: { type: GraphQLInt, resolve: prop('shotsAgainst') },
    goalsAgainst: { type: GraphQLInt, resolve: prop('goalsAgainst') },
    powerPlaySavePercentage: { type: GraphQLFloat, resolve: prop('powerPlaySavePercentage') },
    shortHandedSavePercentage: { type: GraphQLFloat, resolve: prop('shortHandedSavePercentage') },
    evenStrengthSavePercentage: { type: GraphQLFloat, resolve: prop('evenStrengthSavePercentage') },
    takeaways: { type: GraphQLInt, resolve: prop('takeaways') },
    giveaways: { type: GraphQLInt, resolve: prop('giveaways') },
    faceOffWins: { type: GraphQLInt, resolve: prop('faceOffWins') },
    faceOffTaken: { type: GraphQLInt, resolve: prop('faceoffTaken') },
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
    seasonTotal: { type: GraphQLInt, resolve: prop('seasonTotal') },
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
    // Decorators
    isRookie: {
      type: GraphQLBoolean,
      resolve: p => fetchInfoForPlayerId(p.id)
        .then(path(['rookie']))
    },
    isActive: {
      type: GraphQLBoolean,
      resolve: p => fetchInfoForPlayerId(p.id)
        .then(path(['active']))
    },
    isInjured: {
      type: GraphQLBoolean,
      resolve: p => fetchInfoForPlayerId(p.id)
      .then(pipe(
        path(['rosterStatus']),
        equals('I'),
      ))
    },
    isVeteran: {
      type: GraphQLBoolean,
      resolve: p => fetchAllYearsStatsForPlayerId(p.id)
      .then(pipe(
        map(pathOr(0, ['stat', 'games'])),
        sum,
        lte(500),
      ))
    },
    isHot: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        fetchGameLogsForPlayerId(p.id),
        fetchInfoForPlayerId(p.id),
      ])
      .then(([gameLogs, info]) => isHot(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    isCold: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        fetchGameLogsForPlayerId(p.id),
        fetchInfoForPlayerId(p.id),
      ])
      .then(([gameLogs, info]) => isCold(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    hotColdPoints: {
      type: GraphQLInt,
      resolve: p => fetchGameLogsForPlayerId(p.id).then(hotColdPoints)
    },
    hotColdGames: {
      type: GraphQLInt,
      resolve: () => hotColdGames,
    },
    hotColdPlusMinus: {
      type: GraphQLInt,
      resolve: p => fetchGameLogsForPlayerId(p.id).then(hotColdPlusMinus)
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
      type: GraphQLList(SeasonStat),
      resolve: (p, args) => fetchStatsForPlayerId(p.id, args),
    },
    // Lazy load player stats
    careerStats: {
      type: GraphQLList(SeasonStat),
      resolve: p => fetchAllYearsStatsForPlayerId(p.id),
    },
    // Lazy load player stats
    careerPlayoffStats: {
      type: GraphQLList(SeasonStat),
      resolve: p => fetchAllYearsPlayoffStatsForPlayerId(p.id),
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
      args: {
        lastFive: { type: GraphQLBoolean },
        lastTen: { type: GraphQLBoolean },
      },
      type: GraphQLList(SeasonStat),
      resolve: (p, args) =>
        fetchGameLogsForPlayerId(p.id)
          .then(logs => (args.lastFive ? take(5, logs) : logs))
          .then(logs => (args.lastTen ? take(10, logs) : logs)),
    },
    // Lazy load game logs
    playoffLogs: {
      type: GraphQLList(SeasonStat),
      resolve: p => fetchPlayoffGameLogsForPlayerId(p.id),
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
    isScheduled: {
      type: GraphQLBoolean,
      resolve: status => status.detailedState === 'Scheduled'
    },
    friendlyStatus: {
      type: GraphQLString,
      resolve: status => (
        status.detailedState === 'In Progress' ||
        status.detailedState === 'Scheduled' ||
        status.detailedState === 'In Progress - Critical'
      ) ? ''
        : status.detailedState
    }
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
    seasonTeamStats: { type: TeamStats, resolve: p => fetchStatsForTeamId(p.team.id) },
    players: { type: GraphQLList(Player), resolve: pipe(prop('players'), values) },
  },
});

const PlayByPlay = new GraphQLObjectType({
  name: 'PlayByPlay',
  fields: {
    period: { type: GraphQLInt, resolve: path(['about', 'period']) },
    periodType: { type: GraphQLString, resolve: path(['about', 'periodType']) },
    ordinalNum: { type: GraphQLString, resolve: path(['about', 'ordinalNum']) },
    periodTime: { type: GraphQLString, resolve: path(['about', 'periodTime']) },
    periodTimeRemaining: { type: GraphQLString, resolve: path(['about', 'periodTimeRemaining']) },
    dateTime: { type: GraphQLString, resolve: path(['about', 'dateTime']) },
    event: { type: GraphQLString, resolve: path(['result', 'event']) },
    eventCode: { type: GraphQLString, resolve: path(['result', 'eventCode']) },
    eventTypeId: { type: GraphQLString, resolve: path(['result', 'eventTypeId']) },
    description: { type: GraphQLString, resolve: path(['result', 'description']) },
  },
});

const GoalGameEvent = new GraphQLObjectType({
  name: 'GoalGameEvent',
  fields: {
    period: { type: GraphQLInt, resolve: path(['about', 'period']) },
    periodTime: { type: GraphQLString, resolve: path(['about', 'periodTime']) },
    team: { type: TeamInfo, resolve: prop('team') },
    strength: { type: GraphQLString, resolve: path(['result', 'strength', 'name']) },
    isWinningGoal: { type: GraphQLBoolean, resolve: path(['result', 'gameWinningGoal']) },
    isEmptyNet: { type: GraphQLBoolean, resolve: path(['result', 'emptyNet']) },
    scorer: {
      type: Person,
      resolve: d => ({
        ...path(['players', 0, 'player'], d),
        seasonTotal: path(['players', 0, 'seasonTotal'], d),
      }),
    },
    assists: {
      type: GraphQLList(Person),
      resolve: d => pipe(
        prop('players'),
        filter(p => p.playerType === 'Assist'),
        map(a => ({
          ...prop('player', a),
          seasonTotal: prop('seasonTotal', a),
        })),
      )(d),
    },
  },
});

const PenaltyGameEvent = new GraphQLObjectType({
  name: 'PenaltyGameEvent',
  fields: {
    period: { type: GraphQLInt, resolve: path(['about', 'period']) },
    periodTime: { type: GraphQLString, resolve: path(['about', 'periodTime']) },
    team: { type: TeamInfo, resolve: prop('team') },
    receiver: { type: Person, resolve: path(['players', 0, 'player']) },
    type: { type: GraphQLString, resolve: path(['result', 'secondaryType']) },
    severity: { type: GraphQLString, resolve: path(['result', 'penaltySeverity']) },
    minutes: { type: GraphQLInt, resolve: path(['result', 'penaltyMinutes']) },
  },
});

const ShootoutScore = new GraphQLObjectType({
  name: 'ShootoutScore',
  fields: {
    scores: { type: GraphQLInt, resolve: prop('scores') },
    attempts: { type: GraphQLInt, resolve: prop('attempts') },
  },
});

const Shootout = new GraphQLObjectType({
  name: 'Shootout',
  fields: {
    away: { type: ShootoutScore, resolve: prop('away') },
    home: { type: ShootoutScore, resolve: prop('home') },
  },
});

const LiveFeed = new GraphQLObjectType({
  name: 'LiveFeed',
  fields: {
    status: { type: GameStatus, resolve: path(['gameData', 'status']) },
    lastTenPlays: {
      type: GraphQLList(PlayByPlay),
      resolve: pipe(
        pathOr([], ['liveData', 'plays', 'allPlays']),
        takeLast(10),
      ),
    },
    goalSummary: {
      type: GraphQLList(GoalGameEvent),
      resolve: pipe(
        pathOr([], ['liveData', 'plays', 'allPlays']),
        filter(d => d.result.event === 'Goal'),
      ),
    },
    penaltySummary: {
      type: GraphQLList(PenaltyGameEvent),
      resolve: pipe(
        pathOr([], ['liveData', 'plays', 'allPlays']),
        filter(d => d.result.event === 'Penalty'),
      ),
    },
    shootoutSummary: {
      type: Shootout,
      resolve: pathOr({}, ['liveData', 'linescore', 'shootoutInfo']),
    },
    finalPeriod: {
      type: GraphQLString,
      resolve: pipe(
        pathOr([], ['liveData', 'plays', 'allPlays']),
        takeLast(10),
        getFinalPeriod,
      )
    }
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

const Boxscore = new GraphQLObjectType({
  name: 'Boxscore',
  fields: {
    id: { type: GraphQLString, resolve: prop('id') },
    away: { type: TeamBoxscore, resolve: path(['away']) },
    home: { type: TeamBoxscore, resolve: path(['home']) },
  },
});

const GameGoalHighlight = new GraphQLObjectType({
  name: 'GameGoalHighlight',
  fields: {
    statsEventId: { type: GraphQLString, resolve: prop('statsEventId') },
    periodTime: { type: GraphQLString, resolve: prop('periodTime') },
    period: { type: GraphQLInt, resolve: prop('period') },
    url: { type: GraphQLString, resolve: prop('url') },
  },
});

const GameHighlights = new GraphQLObjectType({
  name: 'GameHighlights',
  fields: {
    recap: { type: GraphQLString, resolve: prop('recap') },
    goals: { type: GraphQLList(GameGoalHighlight), resolve: prop('goals') },
  },
});

const SeriesSummary = new GraphQLObjectType({
  name: 'SeriesSummary',
  fields: {
    gamePk: { type: GraphQLInt, resolve: prop('gamePk') },
    gameNumber: { type: GraphQLInt, resolve: prop('gameNumber') },
    gameLabel: { type: GraphQLString, resolve: prop('gameLabel') },
    necessary: { type: GraphQLBoolean, resolve: prop('necessary') },
    gameCode: { type: GraphQLInt, resolve: prop('gameCode') },
    gameTime: { type: GraphQLString, resolve: prop('gameTime') },
    seriesStatus: { type: GraphQLString, resolve: prop('seriesStatus') },
    seriesStatusShort: { type: GraphQLString, resolve: prop('seriesStatusShort') },
  },
});

const Game = new GraphQLObjectType({
  name: 'Game',
  fields: {
    id: { type: GraphQLString, resolve: d => prop('gamePk', d) },
    link: { type: GraphQLString, resolve: prop('link') },
    gameType: { type: GraphQLString, resolve: prop('gameType') },
    season: { type: GraphQLString, resolve: prop('season') },
    gameDate: { type: GraphQLString, resolve: prop('gameDate') },
    status: { type: GameStatus, resolve: prop('status') },
    teams: { type: Matchup, resolve: prop('teams') },
    // Lazy load live feed
    liveFeed: { type: LiveFeed, resolve: p => fetchLiveFeed(p.gamePk) },
    // Lazy load boxscore
    boxscore: { type: Boxscore, resolve: p => fetchBoxscore(p.gamePk) },
    highlights: { type: GameHighlights, resolve: p => fetchGameHighlights(p.gamePk) },
    // Playoffs series
    seriesSummary: { type: SeriesSummary, resolve: prop('seriesSummary') },
    statusText: {
      type: GraphQLString,
      resolve: (game) => fetchLiveFeed(game.gamePk)
        .then((liveFeed) => getStatusText(game.status, liveFeed.gameData, game.gameDate))
    },
  },
});

const PlayerBio = new GraphQLObjectType({
  name: 'PlayerBio',
  fields: {
    name: { type: GraphQLString, resolve: prop('playerName') },
    id: { type: GraphQLInt, resolve: prop('playerId') },
  },
});

const PlayerReport = new GraphQLObjectType({
  name: 'PlayerReport',
  fields: {
    assists: { type: GraphQLInt, resolve: prop('assists') },
    faceoffWinPctg: { type: GraphQLFloat, resolve: prop('faceoffWinPctg') },
    gameWinningGoals: { type: GraphQLInt, resolve: prop('gameWinningGoals') },
    gamesPlayed: { type: GraphQLInt, resolve: prop('gamesPlayed') },
    goals: { type: GraphQLInt, resolve: prop('goals') },
    otGoals: { type: GraphQLInt, resolve: prop('otGoals') },
    penaltyMinutes: { type: GraphQLInt, resolve: prop('penaltyMinutes') },
    birthCity: { type: GraphQLString, resolve: prop('playerBirthCity') },
    birthCountry: { type: GraphQLString, resolve: prop('playerBirthCountry') },
    birthDate: { type: GraphQLString, resolve: prop('playerBirthDate') },
    birthStateProvince: { type: GraphQLString, resolve: prop('playerBirthStateProvince') },
    draftOverallPickNo: { type: GraphQLInt, resolve: prop('playerDraftOverallPickNo') },
    draftRoundNo: { type: GraphQLInt, resolve: prop('playerDraftRoundNo') },
    draftYear: { type: GraphQLInt, resolve: prop('playerDraftYear') },
    firstName: { type: GraphQLString, resolve: prop('playerFirstName') },
    height: { type: GraphQLInt, resolve: prop('playerHeight') },
    id: { type: GraphQLInt, resolve: prop('playerId') },
    inHockeyHof: { type: GraphQLInt, resolve: prop('playerInHockeyHof') },
    isActive: { type: GraphQLInt, resolve: prop('playerIsActive') },
    lastName: { type: GraphQLString, resolve: prop('playerLastName') },
    name: { type: GraphQLString, resolve: prop('playerName') },
    nationality: { type: GraphQLString, resolve: prop('playerNationality') },
    positionCode: { type: GraphQLString, resolve: prop('playerPositionCode') },
    shootsCatches: { type: GraphQLString, resolve: prop('playerShootsCatches') },
    teams: {
      type: GraphQLList(TeamInfo),
      resolve: pipe(
        prop('playerTeamsPlayedFor'),
        replace(/\s/g, ''),
        split(','),
        map(teamAbr => find(propEq('abbreviation', teamAbr))(TEAMS)),
      ),
    },
    weight: { type: GraphQLInt, resolve: prop('playerWeight') },
    plusMinus: { type: GraphQLInt, resolve: prop('plusMinus') },
    points: { type: GraphQLInt, resolve: prop('points') },
    pointsPerGame: { type: GraphQLFloat, resolve: prop('pointsPerGame') },
    ppGoals: { type: GraphQLInt, resolve: prop('ppGoals') },
    ppPoints: { type: GraphQLInt, resolve: prop('ppPoints') },
    seasonId: { type: GraphQLInt, resolve: prop('seasonId') },
    shGoals: { type: GraphQLInt, resolve: prop('shGoals') },
    shPoints: { type: GraphQLInt, resolve: prop('shPoints') },
    shiftsPerGame: { type: GraphQLFloat, resolve: prop('shiftsPerGame') },
    shootingPctg: { type: GraphQLString, resolve: d => (d.shootingPctg * 100).toFixed(1) },
    shots: { type: GraphQLInt, resolve: prop('shots') },
    timeOnIcePerGame: {
      type: GraphQLString,
      resolve: (d) => {
        const secondsCount = propOr(0, 'timeOnIcePerGame', d);
        const minutesDecimals = secondsCount / 60;
        const minutes = Math.floor(minutesDecimals);
        const secondsDecimals = minutesDecimals - minutes;
        const seconds = secondsDecimals * 60;
        return `${minutes.toFixed(0)}:${seconds > 10 ? seconds.toFixed(0) : `0${seconds.toFixed(0)}`}`;
      },
    },
    blockedShots: { type: GraphQLInt, resolve: prop('blockedShots') },
    blockedShotsPerGame: { type: GraphQLFloat, resolve: prop('blockedShotsPerGame') },
    faceoffs: { type: GraphQLInt, resolve: prop('faceoffs') },
    faceoffsLost: { type: GraphQLInt, resolve: prop('faceoffsLost') },
    faceoffsWon: { type: GraphQLInt, resolve: prop('faceoffsWon') },
    giveaways: { type: GraphQLInt, resolve: prop('giveaways') },
    goalsPerGame: { type: GraphQLFloat, resolve: prop('goalsPerGame') },
    hits: { type: GraphQLInt, resolve: prop('hits') },
    hitsPerGame: { type: GraphQLFloat, resolve: prop('hitsPerGame') },
    missedShots: { type: GraphQLInt, resolve: prop('missedShots') },
    missedShotsPerGame: { type: GraphQLFloat, resolve: prop('missedShotsPerGame') },
    shotsPerGame: { type: GraphQLFloat, resolve: prop('shotsPerGame') },
    takeaways: { type: GraphQLInt, resolve: prop('takeaways') },
    rookie: { type: GraphQLBoolean, resolve: prop('rookie') },
    // goalies
    ties: { type: GraphQLInt, resolve: prop('ties') },
    wins: { type: GraphQLInt, resolve: prop('wins') },
    losses: { type: GraphQLInt, resolve: prop('losses') },
    otLosses: { type: GraphQLInt, resolve: prop('otLosses') },
    goalsAgainst: { type: GraphQLInt, resolve: prop('goalsAgainst') },
    goalsAgainstAverage: { type: GraphQLFloat, resolve: prop('goalsAgainstAverage') },
    saves: { type: GraphQLInt, resolve: prop('saves') },
    shotsAgainst: { type: GraphQLInt, resolve: r => r.evShotsAgainst + r.ppShotsAgainst + r.shShotsAgainst },
    savePercentage: { type: GraphQLFloat, resolve: prop('savePctg') },
    shutouts: { type: GraphQLInt, resolve: prop('shutouts') },
  },
});

const PlayerStreak = new GraphQLObjectType({
  name: 'PlayerStreak',
  fields: {
    id: { type: GraphQLInt, resolve: prop('playerId') },
    name: { type: GraphQLString, resolve: prop('playerName') },
    games: { type: GraphQLInt, resolve: path(['streak', 'games']) },
    goals: { type: GraphQLInt, resolve: path(['streak', 'goals']) },
    assists: { type: GraphQLInt, resolve: path(['streak', 'assists']) },
    shots: { type: GraphQLInt, resolve: path(['streak', 'shots']) },
    points: { type: GraphQLInt, resolve: path(['streak', 'points']) },
    shots: { type: GraphQLInt, resolve: path(['streak', 'shots']) },
    hits: { type: GraphQLInt, resolve: path(['streak', 'hits']) },
    pim: { type: GraphQLInt, resolve: path(['streak', 'pim']) },
    powerPlayPoints: { type: GraphQLInt, resolve: path(['streak', 'powerPlayPoints']) },
    plusMinus: { type: GraphQLInt, resolve: path(['streak', 'plusMinus']) },
    teamId: {
      type: GraphQLInt,
      resolve: pipe(
        prop('playerTeamsPlayedFor'),
        replace(/\s/g, ''),
        split(','),
        head,
        teamAbr => find(propEq('abbreviation', teamAbr))(TEAMS),
        prop('id'),
      ),
    },
    // teamId: { type: GraphQLInt, resolve: prop('teamId') },
    positionCode: { type: GraphQLString, resolve: prop('playerPositionCode') },
  },
});

const TeamStreak = new GraphQLObjectType({
  name: 'TeamStreak',
  fields: {
    id: { type: GraphQLInt, resolve: prop('id') },
    name: { type: GraphQLString, resolve: prop('name') },
    teamName: { type: GraphQLString, resolve: prop('teamName') },
    abbreviation: { type: GraphQLString, resolve: prop('abbreviation') },
    wins: { type: GraphQLInt, resolve: path(['streak', 'wins']) },
    losses: { type: GraphQLInt, resolve: path(['streak', 'losses']) },
    ot: { type: GraphQLInt, resolve: path(['streak', 'ot']) },
    games: { type: GraphQLInt, resolve: path(['streak', 'games']) },
    points: { type: GraphQLInt, resolve: path(['streak', 'points']) },
    goalsFor: { type: GraphQLInt, resolve: path(['streak', 'goalsFor']) },
    goalsAgainst: { type: GraphQLInt, resolve: path(['streak', 'goalsAgainst']) },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      playersReport: {
        args: { season: { type: GraphQLString } },
        type: GraphQLList(PlayerReport),
        resolve: (root, args) => fetchPlayersReport(args.season),
      },
      searchPlayers: {
        type: GraphQLList(PlayerBio),
        args: { filter: { type: GraphQLString } },
        resolve: fetchAllHistoryPlayers,
      },
      players: {
        args: { season: { type: GraphQLString } },
        type: GraphQLList(Player),
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
        args: { season: { type: GraphQLString } },
        type: GraphQLList(TeamInfo),
        resolve: (root, args) => fetchAllTeams(args),
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
        args: { id: { type: GraphQLString } },
        type: Game,
        resolve: (root, args) => ({ gamePk: args.id }),
      },
      draft: {
        args: { year: { type: GraphQLInt } },
        type: GraphQLList(DraftPick),
        resolve: (root, args) => fetchDraft(args),
      },
      playerStreaks: {
        args: { limit: { type: GraphQLInt } },
        type: GraphQLList(PlayerStreak),
        resolve: (r, args) => calculatePlayerStreaks(args),
      },
      teamsStreaks: {
        args: { limit: { type: GraphQLInt } },
        type: GraphQLList(TeamStreak),
        resolve: (r, args) => calculateTeamsStreaks(args),
      },
    },
  }),
});

module.exports = schema;
