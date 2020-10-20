const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql')

const Player = require('./player')
const Streaks = require('./streaks')
const Standings = require('./standings')
const Report = require('./report')
const Team = require('./team')
const ScheduledGame = require('./schedule')
const Game = require('./game')

const { flatten, prop, sortBy } = require('ramda')

const {
  providedArgs,
} = require('./deconstructors')

const {
  teamsLoader,
  gamesScheduleLoader,
  playersLoader,
} = require('../../loaders/nhl')

const TeamName = new GraphQLObjectType({
  name: 'TeamName',
  fields: {
    id: { type: GraphQLInt, resolve: doc => doc.id },
    name: { type: GraphQLString, resolve: doc => doc.name },
    abbreviation: { type: GraphQLString, resolve: doc => doc.abbreviation },
  }
})

const PlayerName = new GraphQLObjectType({
  name: 'PlayerName',
  fields: {
    id: { type: GraphQLInt, resolve: doc => doc.playerId },
    name: { type: GraphQLString, resolve: doc => doc.skaterFullName || doc.goalieFullName },
    birthDate: { type: GraphQLString, resolve: doc => doc.birthDate },
    nationality: { type: GraphQLString, resolve: doc => doc.nationalityCode },
    position: { type: GraphQLString, resolve: doc => doc.positionCode || 'G' },

  }
})

const NHLQuery = new GraphQLObjectType({
  name: 'NHLQuery',
  fields: {
    player: {
      type: Player,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: providedArgs,
    },

    team: {
      type: new GraphQLList(Team),
      args: {
        id: { type: GraphQLInt },
        season: { type: GraphQLString },
      },
      resolve: (_, args) => {
        if (args.id) {
          return [args]
        } else {
          return teamsLoader.load(args.season).then(teams => { 
            teams.forEach(team => {
              team.season = args.season
            })
            return teams
          })
        }
      },
    },

    game: {
      type: Game,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: providedArgs,
    },

    leaders: {
      type: Report,
      args: {
        season: { type: GraphQLString },
      },
      resolve: providedArgs,
    },

    standings: {
      type: Standings,
      args: {
        season: { type: GraphQLString },
      },
      resolve: providedArgs,
    },

    streaks: {
      type: Streaks,
      resolve: providedArgs,
    },

    players: {
      type: new GraphQLList(PlayerName),
      args: {
        season: { type: GraphQLString },
      },
      resolve: (_, args) => playersLoader.load(args.season).then((players) => {
        return sortBy(prop('playerName'), flatten(players))
      }),
    },

    teams: {
      type: new GraphQLList(TeamName),
      args: {
        season: { type: GraphQLString },
      },
      resolve: (_, args) => teamsLoader.load(args.season).then((teams) => {
        return sortBy(prop('name'), teams)
      }),
    },

    schedule: {
      type: new GraphQLList(ScheduledGame),
      args: {
        dates: { type: new GraphQLList(GraphQLString) },
      },
      resolve: (_, args) => Promise
        .all((args.dates || []).map(date => gamesScheduleLoader.load(date)))
        .then(games => flatten(games))
    }
  },
})

module.exports = NHLQuery


/*
query players {
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

query game {
  nhl {
    game (id: 2019020263) {
      recap
      goalsHighlights {
        statsEventId
        periodTime
        period
        url
      }
    }
  }
}


query schedule {
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

query teams {
  nhl {
    teams (season:"20182019") {
      id
      name
    }
  }
}

query team {
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

query leaders {
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

query standings {
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


query playersStreaks {
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

query teamsStreaks {
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


query player {
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
*/