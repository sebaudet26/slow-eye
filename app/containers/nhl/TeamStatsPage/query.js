import { gql } from 'apollo-boost';

const getTeamsQuery = gql`
query($season: String) {
  nhl {
    team(season: $season) {
      id
      name
      abbreviation
      teamName
      locationName
      shortName
      active
      gamesPlayed
      wins
      losses
      ot
      pts
      powerPlayGoals
      powerPlayGoalsAgainst
      faceOffsTaken
      faceOffsWon
      faceOffsLost
      powerPlayOpportunities
      goalsForPerGame
      goalsAgainstPerGame
      evGGARatio
      shotsPerGame
      shotsAllowed
      winScoreFirst
      winOppScoreFirst
      winLeadFirstPer
      winLeadSecondPer
      winOutshootOpp
      winOutshotByOpp
      shootingPctg
      savePctg
      ptPctg
      powerPlayPercentage
      penaltyKillPercentage
      faceOffWinPercentage
    }
  }
}
`;

export {
  getTeamsQuery,
};
