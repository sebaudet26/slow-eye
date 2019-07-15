import { gql } from 'apollo-boost';

const getTeamQuery = gql`
query($teamId: ID, $playerID: ID){
  team (id: ${teamId}) {
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
  {
    player (id: ${playerId}) {
      id
      info {
        firstName
        lastName
        shootsCatches
        birthDate
        birthCity
        birthStateProvince
        birthCountry
        nationality
        height
        weight
        captain
        rookie
        fullName
        currentAge
        rosterStatus
        primaryNumber
        currentTeamInfo {
          name
          teamName
          abbreviation
        }
        primaryPosition {
          name
          abbreviation
        }
        draftInfo {
          year
          round
          pickOverall
          pickInRound
          team {
            name
            abbreviation
          }
        }
      }
      stats {
        season
        team {
          name
          abbreviation
        }
        league {
          name
        }
        stat {
          assists
          goals
          points
          games
          plusMinus
          shots
          shotPct
          hits
          pim
          blocked
          timeOnIcePerGame
          savePercentage
          goalsAgainst
          saves
          shutouts
          goalAgainstAverage
          powerPlayGoals
          shortHandedGoals
          gameWinningGoals
          gamesStarted
          wins
          losses
          ot
        }
      }
      logs (lastTen: true){
        date
        stat {
          points
          plusMinus
          timeOnIce
        }
      }
    }
  }
}
`;

export { getTeamQuery };
