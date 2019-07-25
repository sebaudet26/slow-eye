import { gql } from 'apollo-boost';

const getPlayersQuery = gql`
{
  playersReport (season: "20182019") {
    id
    name
    nationality
    positionCode
    gamesPlayed
    goals
    assists
    points
    plusMinus
    penaltyMinutes
    ppGoals
    shGoals
    teams {
      id
      abbreviation
    }
    hits
    rookie
    blockedShots
    shots
    shootingPctg
    timeOnIcePerGame
    ties
    wins
    losses
    otLosses
    goalsAgainst
    goalsAgainstAverage
    saves
    shotsAgainst
    savePercentage
    shutouts
  }

  teams (season: "20182019") {
    id
    abbreviation
    name
  }
}`;

export {
  getPlayersQuery,
};
