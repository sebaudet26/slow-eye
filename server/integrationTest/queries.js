const players = `query {
  nhl {
    players (season: "all") {
      id
      name
      birthDate
      nationality
      position
    }
  }
}
`

const game = `query {
  nhl {
    game (id: 2019020263) {
      recap
      goalsHighlights {
        statsEventId
        periodTime
        period
        url
      }
      awayTeam {
        coach
        teamId
        teamName
        playerStats {
          id
          name
          jerseyNumber
          position
          assists
          goals
          shots
          hits
          powerPlayGoals
          powerPlayAssists
          penaltyMinutes
          faceOffWins
          faceoffTaken
          takeaways
          giveaways
          shortHandedGoals
          shortHandedAssists
          blocked
          plusMinus
          faceOffPct
          timeOnIce
          evenTimeOnIce
          powerPlayTimeOnIce
          shortHandedTimeOnIce
        }
        teamStats {
          goals
          pim
          shots
          powerPlayGoals
          powerPlayOpportunities
          blocked
          takeaways
          giveaways
          hits
          faceOffWinPercentage
          powerPlayPercentage
        }
      }
      homeTeam {
        coach
        teamId
        teamName
        playerStats {
          id
          name
          jerseyNumber
          position
          assists
          goals
          shots
          hits
          powerPlayGoals
          powerPlayAssists
          penaltyMinutes
          faceOffWins
          faceoffTaken
          takeaways
          giveaways
          shortHandedGoals
          shortHandedAssists
          blocked
          plusMinus
          faceOffPct
          timeOnIce
          evenTimeOnIce
          powerPlayTimeOnIce
          shortHandedTimeOnIce
        }
        teamStats {
          goals
          pim
          shots
          powerPlayGoals
          powerPlayOpportunities
          blocked
          takeaways
          giveaways
          hits
          faceOffWinPercentage
          powerPlayPercentage
        }
      }
    }
  }
}
`

const schedule = `query {
  nhl {
    schedule (dates: ["2019-11-10"]) {
      id
      gameType
      season
      gameDate
      abstractGameState
      codedGameState
      detailedState
      statusCode
      startTimeTBD
      awayTeam {
        id
        name
        score
        wins
        losses
        ot
      }
      homeTeam {
        id
        name
        score
        wins
        losses
        ot
      }
    }
  }
}
`

const teams = `query {
  nhl {
    teams (season:"20182019") {
      id
      name
    }
  }
}
`

const team = `query {
  nhl {
    team (id: 1, season:"20182019") {
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
      goalsPerGame
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
      roster {
        id
        name
        position
        jerseyNumber
      }
    }
  }
}
`

const leaders = `query {
  nhl {
    leaders (season: "20182019") {
      skaters {
        playerBirthCountry
        playerBirthDate
        playerFirstName
        playerLastName
        playerName
        playerNationality
        playerPositionCode
        playerShootsCatches
        playerTeamsPlayedFor
        rookie
        blockedShots
        faceoffs
        faceoffsLost
        faceoffsWon
        giveaways
        goals
        hits
        missedShots
        shots
        takeaways
        assists
        gameWinningGoals
        otGoals
        penaltyMinutes
        plusMinus
        points
        ppGoals
        ppPoints
        shGoals
        shPoints
        missedShotsPerGame
        blockedShotsPerGame
        faceoffWinPctg
        goalsPerGame
        hitsPerGame
        shootingPctg
        shotsPerGame
        pointsPerGame
        shiftsPerGame
        timeOnIcePerGame
        gamesPlayed
        gamesStarted
        goalsAgainst
        losses
        otLosses
        playerHeight
        playerId
        playerInHockeyHof
        playerIsActive
        playerWeight
        saves
        seasonId
        shotsAgainst
        shutouts
        ties
        timeOnIce
        wins
        savePctg
        goalsAgainstAverage
      }
    }
  }
}
`

const standings = `query {
  nhl {
    standings(season:"20182019") {
      season
      wildCard {
        goalsAgainst
        goalsScored
        points
        divisionRank
        conferenceRank
        leagueRank
        wildCardRank
        gamesPlayed
        streak
        record {
          wins
          losses
          ot
        }
        awayRecord {
          wins
          losses
          ot
        }
        homeRecord {
          wins
          losses
          ot
        }
        shootOutsRecord {
          wins
          losses
          ot
        }
        lastTenRecord{
          wins
          losses
          ot
        }
        teamId
        teamName
      }
    }
  }
}
`

const playersStreaks = `query {
  nhl {
   	streaks {
      players {
        id
        name
        games
        goals
        assists
        shots
        points
        shots
        hits
        pim
        plusMinus
      }
    }
  }
}
`
const teamsStreaks = `query {
  nhl {
    streaks {
      teams {
        id
        name
        teamName
        abbreviation
        wins
        losses
        ot
        games
        points
      }
    }
  }
}
`

const player = `query {
  nhl{
    #  8471679   8477956
    player(id: 8477956) {
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
        weight{
          kilograms
          pounds
        }
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
        position
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
        draftYear
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
`


module.exports = {
  players,
  game,
  schedule,
  teams,
  team,
  leaders,
  standings,
  playersStreaks,
  teamsStreaks,
  player,
}