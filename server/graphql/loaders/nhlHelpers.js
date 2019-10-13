const calculateTeamPointsStreak = (team) => {
  const gamesToConsider = pipe(
    prop('schedule'),
    map(prop('game')),
    filter(game => game.gameType === 'R'),
    reverse,
    take(teamStreakDefaultNumberOfGames + 1)
  )(team)

  const goalsFor = pipe(
    tail,
    map(game => (game.teams.home.team.id === team.id ? takeHomeTeam(game) : takeAwayTeam(game))),
    map(prop('score')),
    sum,
  )(gamesToConsider)

  const goalsAgainst = pipe(
    tail,
    map(game => (game.teams.home.team.id !== team.id ? takeHomeTeam(game) : takeAwayTeam(game))),
    map(prop('score')),
    sum,
  )(gamesToConsider)

  const firstGame = last(gamesToConsider)
  const lastGame = head(gamesToConsider)


  let initialRecord = emptyRecord
  let latestRecord  = emptyRecord

  if (gamesToConsider.length > 1) {
    latestRecord = lastGame.teams.home.team.id === team.id
      ? lastGame.teams.home.leagueRecord
      : lastGame.teams.away.leagueRecord
  }

  if (gamesToConsider.length > teamStreakDefaultNumberOfGames) {
    initialRecord = firstGame.teams.home.team.id === team.id
      ? firstGame.teams.home.leagueRecord
      : firstGame.teams.away.leagueRecord
  }

  const streak = {
    wins: latestRecord.wins - initialRecord.wins,
    losses: latestRecord.losses - initialRecord.losses,
    ot: latestRecord.ot - initialRecord.ot,
    games: teamStreakDefaultNumberOfGames,
    isValid: latestRecord.wins >= initialRecord.wins,
    goalsAgainst,
    goalsFor,
  }

  return {
    ...team,
    streak: {
      ...streak,
      points: Math.round(streak.wins * 2 + streak.ot),
    },
  }
}

module.exports = {
	calculateTeamPointsStreak,
}