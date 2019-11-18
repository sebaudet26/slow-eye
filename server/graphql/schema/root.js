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

const { prop, sortBy } = require('ramda')

const { teamsLoader } = require('../loaders/nhl')

const itself = () => ({})

const TeamId = new GraphQLObjectType({
  name: 'TeamId',
  fields: {
    id: { type: GraphQLInt, resolve: doc => doc.id },
    name: { type: GraphQLString, resolve: doc => doc.name },
    abbreviation: { type: GraphQLString, resolve: doc => doc.abbreviation },
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
      resolve: (_, args) =>  ({ id: args.id }),
    },

    team: {
      type: Team,
      args: {
        id: { type: GraphQLInt },
        season: { type: GraphQLString },
      },
      resolve: (_, args) => ({ id: args.id, season: args.season }),
    },

    teams: {
      type: new GraphQLList(TeamId),
      args: {
        season: { type: GraphQLString },
      },
      resolve: (_, args) => teamsLoader.load(args.season).then((teams) => {
        return sortBy(prop('name'), teams)
      }),
    },

    leaders: {
      type: Report,
      args: {
        season: { type: GraphQLString },
      },
      resolve: (_, args) =>  ({ season: args.season }),
    },

    standings: {
      type: Standings,
      args: {
        season: { type: GraphQLString },
      },
      resolve: (_, args) =>  ({ season: args.season }),
    },

    streaks: {
      type: Streaks,
      resolve: itself,
    }
  },
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      nhl: { type: NHLQuery, resolve: itself }
    },
  })
})

module.exports = schema


/*
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