const {
  contains,
  descend,
  filter,
  find,
  flatten,
  head,
  last,
  map,
  mergeAll,
  mergeLeft,
  omit,
  path,
  pathEq,
  pathOr,
  pick,
  pipe,
  prop,
  propEq,
  propOr,
  reverse,
  sum,
  sortBy,
  sortWith,
  tail,
  take,
  takeLast,
} = require('ramda');

const emptyRecord = { wins: 0, losses: 0, ot: 0 }
const teamStreakDefaultNumberOfGames = 15;
const playerStreakDefaultNumberOfGames = 5;
const takeHomeTeam = path(['teams', 'home']);
const takeAwayTeam = path(['teams', 'away']);

const calculateTeamPointsStreak = (team) => {
  const gamesToConsider = pipe(
    prop('schedule'),
    map(prop('game')),
    filter(game => game.gameType === 'R'),
    reverse,
    take(teamStreakDefaultNumberOfGames + 1)
  )(team)

  const firstGame = last(gamesToConsider)
  const lastGame = head(gamesToConsider)

  let initialRecord = emptyRecord
  let latestRecord  = emptyRecord

  if (gamesToConsider.length) {
    latestRecord = lastGame.teams.home.team.id === team.id
      ? lastGame.teams.home.leagueRecord
      : lastGame.teams.away.leagueRecord
  }

  if (gamesToConsider.length > teamStreakDefaultNumberOfGames) {
    initialRecord = firstGame.teams.home.team.id === team.id
      ? firstGame.teams.home.leagueRecord
      : firstGame.teams.away.leagueRecord
  }

  const wins = latestRecord.wins - initialRecord.wins
  const losses = latestRecord.losses - initialRecord.losses
  const ot = latestRecord.ot - initialRecord.ot

  const streak = {
    wins,
    losses,
    ot,
    games: wins+losses+ot,
  }

  return {
    ...team,
    streak: {
      ...streak,
      points: Math.round(streak.wins * 2 + streak.ot),
    },
  }
}

const calculatePlayerPointsStreak = player => ({
  ...player,
  streak: {
    points: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'points'])),
      sum,
    )(player),
    goals: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'goals'])),
      sum,
    )(player),
    assists: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'assists'])),
      sum,
    )(player),
    shots: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'shots'])),
      sum,
    )(player),
    hits: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'hits'])),
      sum,
    )(player),
    pim: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'penaltyMinutes'])),
      sum,
    )(player),
    powerPlayPoints: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'powerPlayPoints'])),
      sum,
    )(player),
    plusMinus: pipe(
      prop('logs'),
      take(playerStreakDefaultNumberOfGames),
      map(path(['stat', 'plusMinus'])),
      sum,
    )(player),
    games: playerStreakDefaultNumberOfGames,
  },
})

const timeOnIceToSeconds = timeOneIceString => (
  Number(timeOneIceString.split(':')[0]) * 60 + Number(timeOneIceString.split(':')[1])
);

const hotColdGames = 10;
const pointsPerThousandSecondsToBeCold = {
  C: 0.25,
  LW: 0.25,
  RW: 0.25,
  D: 0.16,
};
const pointsPerThousandSecondsToBeHot = {
  C: 0.9,
  LW: 0.9,
  RW: 0.9,
  D: 0.5,
};
const plusMinusColdThreshold = -5;
const veteranGames = 500;

const getPointsInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'points'])),
  sum,
);

const getSecondsPlayedInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'timeOnIce'])),
  map(timeOnIceToSeconds),
  sum,
);

const cumulativePlusMinusInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'plusMinus'])),
  sum,
);

const hotColdPlusMinus = gameLogs => cumulativePlusMinusInLastGames(gameLogs);

const hotColdPoints = gameLogs => getPointsInLastGames(gameLogs);

const isHot = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) >= pointsPerThousandSecondsToBeHot[pos];
};

const isCold = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (
    (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) <= pointsPerThousandSecondsToBeCold[pos]
    && (pos === 'D' ? cumulativePlusMinusInLastGames(gameLogs) < plusMinusColdThreshold : true)
  );
};

module.exports = {
  isHot,
  isCold,
  hotColdPoints,
  hotColdGames,
  hotColdPlusMinus,

  calculateTeamPointsStreak,
  calculatePlayerPointsStreak,
}