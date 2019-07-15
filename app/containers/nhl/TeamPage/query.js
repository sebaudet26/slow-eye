import { gql } from 'apollo-boost';


// Nest Player Object Type in Roster Of Team Query
const getTeamQuery = gql`
query($id: Int) {
  team (id: $id) {
    id
    name
    link
    abbreviation
    teamName
    ranking {
      conference
      conferenceName
      division
      divisionName
      league
    }
    roster {
      id
    },
    stats {
      type
      splits {
        gamesPlayed
        wins
        losses
        ot
        pts
        ptPctg
        goalsPerGame
        goalsAgainstPerGame
        evGGARatio
        powerPlayPercentage
        powerPlayGoals
        powerPlayGoalsAgainst
        powerPlayOpportunities
        penaltyKillPercentage
        shotsPerGame
        shotsAllowed
        winScoreFirst
        winOppScoreFirst
        winLeadFirstPer
        winLeadSecondPer
        winOutshootOpp
        winOutshotByOpp
        faceOffsTaken
        faceOffsWon
        faceOffsLost
        faceOffWinPercentage
        shootingPctg
        savePctg
      }
    }
  }
}
`;

export { getTeamQuery };
