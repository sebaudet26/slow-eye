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
      isActive
      isInjured
      isVeteran
      isHot
      isCold
      hotColdPoints
      hotColdGames
      hotColdPlusMinus
      pointsInLatestSeason
      stats {
        season
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
        fullName
        currentAge
        rosterStatus
        primaryNumber
        isForward
        isDefenseman
        isGoalie
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
