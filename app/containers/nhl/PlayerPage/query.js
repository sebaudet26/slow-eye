import { gql } from 'apollo-boost';

const getPlayerQuery = gql`
query($id: Int) {
  player (id: $id) {
    isActive
    isInjured
    isVeteran
    isHot
    isCold
    hotColdPoints
    hotColdGames
    hotColdPlusMinus
    hasNHLExperience
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
      isGoalie
      currentTeamInfo {
        id
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
        }
      }
    }
    careerStats {
      season
      team {
        name
        abbreviation
        id
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
        saves
        goalsAgainst
        shutouts
        gamesStarted
        timeOnIce
        savePercentage
        goalAgainstAverage
        wins
        losses
        ot
        ties
      }
    }
    careerPlayoffStats {
      season
      team {
        name
        abbreviation
        id
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
        saves
        goalsAgainst
        shutouts
        gamesStarted
        timeOnIce
        savePercentage
        goalAgainstAverage
        wins
        losses
        ot
        ties
      }
    }
    logs {
      date
      isWin
      isOT
      opponent {
        shortName
        teamName
        id
        abbreviation
      }
      stat {
        goals
        assists
        points
        plusMinus
        hits
        blocked
        powerPlayGoals
        shortHandedGoals
        gameWinningGoals
        pim
        shots
        timeOnIce
        shifts
        saves
        goalsAgainst
        shutouts
        gamesStarted
        timeOnIce
        savePercentage
        goalAgainstAverage
        wins
        losses
        ot
      }
    }
  }
}
`;

export { getPlayerQuery };
