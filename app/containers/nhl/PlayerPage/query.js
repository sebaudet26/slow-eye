import { gql } from 'apollo-boost';

const getPlayerQuery = gql`
query($id: Int) {
  nhl {
    player(id: $id) {
      id
      bio {
        age
        lastName
        firstName
        birthDate
        birthCity
        birthState
        birthCountry
        shootsCatches
        jerseyNumber
        height {
          feet
          inches
        }
        weight {
          kilograms
          pounds
        }
      }
      team {
        id
        name
      }
      status {
        isActive
        isRookie
        isVeteran
        isCaptain
        isAlternate
        isInjured
      }
      position {
        code
        isGoalie
        isDefenseman
        isForward
      }
      streak {
        isHot
        isCold
        hotColdGames
        hotColdPoints
        hotColdPlusMinus
      }
      draft {
        amateurTeam
        amateurLeague
        year
        round
        pickInRound
        overall
        pickHistory
      }
      career {
        seasons {
          season
          leagueName
          teamName
          teamId
          games
          offensive {
            assists
            goals
            shots
            points
            powerPlayGoals
            powerPlayPoints
            gameWinningGoals
            overTimeGoals
            shortHandedGoals
            shortHandedPoints
            shotPct
          }
          defensive {
            penaltyMinutes
            hits
            plusMinus
            pim
            takeaways
            giveaways
            blocked
          }
          goalieStats {
            ot
            shutouts
            ties
            wins
            losses
            saves
            powerPlaySaves
            shortHandedSaves
            evenSaves
            shortHandedShots
            evenShots
            powerPlayShots
            savePercentage
            goalAgainstAverage
            gamesStarted
            shotsAgainst
            goalsAgainst
            powerPlaySavePercentage
            shortHandedSavePercentage
            evenStrengthSavePercentage
          }
          faceoffStats {
            faceOffPct
            faceOffWins
            faceOffTaken
          }
          usageStats {
            shifts
            timeOnIce {
              minutes
              seconds
            }
            powerPlayTimeOnIce {
              minutes
              seconds
            }
            evenTimeOnIce {
              minutes
              seconds
            }
            shortHandedTimeOnIce {
              minutes
              seconds
            }
          }
        }
        playoffs {
          season
          leagueName
          teamName
          teamId
          games
          offensive {
            assists
            goals
            shots
            points
            powerPlayGoals
            powerPlayPoints
            gameWinningGoals
            overTimeGoals
            shortHandedGoals
            shortHandedPoints
            shotPct
          }
          defensive {
            penaltyMinutes
            hits
            plusMinus
            pim
            takeaways
            giveaways
            blocked
          }
          goalieStats {
            ot
            shutouts
            ties
            wins
            losses
            saves
            powerPlaySaves
            shortHandedSaves
            evenSaves
            shortHandedShots
            evenShots
            powerPlayShots
            savePercentage
            goalAgainstAverage
            gamesStarted
            shotsAgainst
            goalsAgainst
            powerPlaySavePercentage
            shortHandedSavePercentage
            evenStrengthSavePercentage
          }
          faceoffStats {
            faceOffPct
            faceOffWins
            faceOffTaken
          }
          usageStats {
            shifts
            timeOnIce {
              minutes
              seconds
            }
            powerPlayTimeOnIce {
              minutes
              seconds
            }
            evenTimeOnIce {
              minutes
              seconds
            }
            shortHandedTimeOnIce {
              minutes
              seconds
            }
          }
        }
      }
      gameLogs {
        season {
          season
          leagueName
          teamName
          teamId
          games
          gameInfo {
            date
            isHome
            isWin
            isOT
            opponentTeamId
            gameId
          }
          offensive {
            assists
            goals
            shots
            points
            powerPlayGoals
            powerPlayPoints
            gameWinningGoals
            overTimeGoals
            shortHandedGoals
            shortHandedPoints
            shotPct
          }
          defensive {
            penaltyMinutes
            hits
            plusMinus
            pim
            takeaways
            giveaways
            blocked
          }
          goalieStats {
            ot
            shutouts
            ties
            wins
            losses
            saves
            powerPlaySaves
            shortHandedSaves
            evenSaves
            shortHandedShots
            evenShots
            powerPlayShots
            savePercentage
            goalAgainstAverage
            gamesStarted
            shotsAgainst
            goalsAgainst
            powerPlaySavePercentage
            shortHandedSavePercentage
            evenStrengthSavePercentage
          }
          faceoffStats {
            faceOffPct
            faceOffWins
            faceOffTaken
          }
          usageStats {
            shifts
            timeOnIce {
              minutes
              seconds
            }
            powerPlayTimeOnIce {
              minutes
              seconds
            }
            evenTimeOnIce {
              minutes
              seconds
            }
            shortHandedTimeOnIce {
              minutes
              seconds
            }
          }
        }
        playoff {
          season
          leagueName
          teamName
          teamId
          games
          gameInfo {
            date
            isHome
            isWin
            isOT
            opponentTeamId
            gameId
          }
          offensive {
            assists
            goals
            shots
            points
            powerPlayGoals
            powerPlayPoints
            gameWinningGoals
            overTimeGoals
            shortHandedGoals
            shortHandedPoints
            shotPct
          }
          defensive {
            penaltyMinutes
            hits
            plusMinus
            pim
            takeaways
            giveaways
            blocked
          }
          goalieStats {
            ot
            shutouts
            ties
            wins
            losses
            saves
            powerPlaySaves
            shortHandedSaves
            evenSaves
            shortHandedShots
            evenShots
            powerPlayShots
            savePercentage
            goalAgainstAverage
            gamesStarted
            shotsAgainst
            goalsAgainst
            powerPlaySavePercentage
            shortHandedSavePercentage
            evenStrengthSavePercentage
          }
          faceoffStats {
            faceOffPct
            faceOffWins
            faceOffTaken
          }
          usageStats {
            shifts
            timeOnIce {
              minutes
              seconds
            }
            powerPlayTimeOnIce {
              minutes
              seconds
            }
            evenTimeOnIce {
              minutes
              seconds
            }
            shortHandedTimeOnIce {
              minutes
              seconds
            }
          }
        }
      }
    }
  }
}
`;

export { getPlayerQuery };
