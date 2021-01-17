import { gql } from 'apollo-boost';

// Nest Player Object Type in Roster Of Team Query
const getTeamQuery = gql`
query($id: Int) {
  nhl {
    team (id: $id) {
      id
      wins
      losses
      ot
      pts
      gamesPlayed
      name
      active
      goalsForPerGame
      goalsAgainstPerGame
      powerPlayPercentage
      penaltyKillPercentage
      roster {
        id
        bio {
          firstName
          lastName
          shootsCatches
          jerseyNumber
          age
          height {
            feet
            inches
          }
          weight {
            pounds
          }
          birthDate
          birthCity
          birthState
          birthCountry
        }
        position { 
          code
          isGoalie
          isForward
          isDefenseman
        }
        draft {
          round
          year
          pickInRound
          pickHistory
          amateurTeam
          amateurLeague
          overall
        }
        streak {
        	isHot
          isCold
          hotColdGames
          hotColdPoints
          pointsPerThousandSeconds
          hotColdPlusMinus
        }
        status {
          isVeteran
          isRookie
          isInjured
          isCaptain
          isAlternate
        }
      }
    }
  }
}
`;

export { getTeamQuery };
