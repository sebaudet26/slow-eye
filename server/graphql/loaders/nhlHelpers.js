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
});

module.exports = {
	calculateTeamPointsStreak,
	calculatePlayerPointsStreak,
}