const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const {
	equals,
	lte,
	map,
	path,
	pathOr,
	pipe,
	prop,
	sum,
	take,
} = require('ramda')

const {
	playerBioLoader,
  playerDraftLoader,
	playerCareerSeasonStatsLoader,
  playerCareerPlayoffsStatsLoader,
	playerSeasonGameLogsLoader,
  playerPlayoffsGameLogsLoader,
} = require('../loaders/nhl')

const {
  isHot,
  isCold,
  hotColdPoints,
  hotColdGames,
  hotColdPlusMinus,
} = require('../streaks')

const {
  Time,
  PlayerHeight,
  PlayerWeight,
  PlayerStatistic,
} = require('./deconstructors')

const POUNDS_TO_KILOGRAMS = 0.453592
const forwardsAbbreviations = ['C', 'LW', 'RW']

const timeStringToTimeType = (timeString = '') => {
  return {
    minutes: Number(timeString.split(':')[0]) || 0,
    seconds: Number(timeString.split(':')[1]) || 0,
  }
}
const resolveProp = propName => obj => Promise.resolve(obj[propName])
const resolvePath = objPath => obj => Promise.resolve(path(objPath, obj))

const itself = (p = {}) => p

const PlayerBio = new GraphQLObjectType({
  name: 'PlayerBio',
  fields: {
    firstName: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('firstName'))
    },
    lastName: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('lastName'))
    },
    birthDate: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('birthDate'))
    },
    birthCity: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('birthCity'))
    },
    birthState: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('birthStateProvince'))
    },
    birthCountry: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('birthCountry'))
    },
    shootsCatches: {
    	type: GraphQLString,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('shootsCatches'))
    },
    // integers
    height: {
    	type: PlayerHeight,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('height'))
    },
    weight: {
    	type: PlayerWeight,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('weight'))
    },
    age: {
    	type: GraphQLInt,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('currentAge'))
    },
    jerseyNumber: {
    	type: GraphQLInt,
    	resolve: p => playerBioLoader.load(p.id)
        .then(p => Number(p['primaryNumber']))
    },
	}
})

const PlayerStatus = new GraphQLObjectType({
	name: 'PlayerStatus',
	fields: {
    isActive: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('active'))
    },
    isRookie: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('rookie'))
    },
    isVeteran: {
    	type: GraphQLBoolean,
    	resolve: p => playerCareerSeasonStatsLoader.load(p.id)
    		.then(pipe(
	        map(pathOr(0, ['stat', 'games'])),
	        sum,
	        lte(500),
	      ))
    },
    isCaptain: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('captain'))
    },
    isAlternate: {
    	type: GraphQLBoolean,
    	resolve: p => playerBioLoader.load(p.id)
        .then(resolveProp('alternateCaptain'))
    },
    isInjured: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
	      .then(pipe(
	        path(['rosterStatus']),
	        equals('I'),
	      ))
    },
	}
})

const PlayerPosition = new GraphQLObjectType({
  name: 'PlayerPosition',
  fields: {
  	position: {
  		type: GraphQLString,
			resolve: p => playerBioLoader.load(p.id)
				.then(resolvePath(['primaryPosition', 'abbreviation']))
  	},
  	isGoalie: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        equals('G')
	      ))
    },
    isDefenseman: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        equals('D')
	      ))
    },
    isForward: {
      type: GraphQLBoolean,
      resolve: p => playerBioLoader.load(p.id)
      	.then(pipe(
	        prop('primaryPosition'),
	        prop('abbreviation'),
	        abb => forwardsAbbreviations.includes(abb),
	      ))
    },
  }
})

const PlayerStreak = new GraphQLObjectType({
  name: 'PlayerStreak',
  fields: {
    isHot: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        playerSeasonGameLogsLoader.load(p.id),
        playerBioLoader.load(p.id),
      ])
      .then(([gameLogs, info]) => isHot(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    isCold: {
      type: GraphQLBoolean,
      resolve: p => Promise.all([
        playerSeasonGameLogsLoader.load(p.id),
        playerBioLoader.load(p.id),
      ])
      .then(([gameLogs, info]) => isCold(take(10, gameLogs), info.primaryPosition.abbreviation))
    },
    hotColdPoints: {
      type: GraphQLInt,
      resolve: p => playerSeasonGameLogsLoader.load(p.id)
        .then(hotColdPoints)
    },
    hotColdGames: {
      type: GraphQLInt,
      resolve: () => hotColdGames,
    },
    hotColdPlusMinus: {
      type: GraphQLInt,
      resolve: p => playerSeasonGameLogsLoader.load(p.id)
        .then(hotColdPlusMinus)
    },
  }
})

const PlayerDraft = new GraphQLObjectType({
	name: 'PlayerDraft',
	fields: {
    amateurTeam: {
      type: GraphQLString,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('amateurClubName'))
    },
    amateurLeague: {
      type: GraphQLString,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('amateurLeague'))
    },
    draftYear: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('draftYear')),
    },
    pickHistory: {
      type: new GraphQLList(GraphQLString),
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('teamPickHistory'))
        .then(history => history.split(',')),
    },
    round: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('roundNumber')),
    },
    pickInRound: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('pickInRound')),
    },
    overall: {
      type: GraphQLInt,
      resolve: p => playerDraftLoader.load(p.id)
        .then(resolveProp('overallPickNumber')),
    },
    // draftedByTeam: {
    //   type: TeamInfo,
    //   resolve: p => playerDraftLoader.load(p.id).then(resolveProp('draftedByTeamId')),
    // },
	},
});

const PlayerCareer = new GraphQLObjectType({
  name: 'PlayerCareer',
  fields: {
    seasons: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerCareerSeasonStatsLoader.load(p.id)
    },
    playoffs: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerCareerPlayoffsStatsLoader.load(p.id)
    }
  },
})

const PlayerGameLogs = new GraphQLObjectType({
	name: 'PlayerGameLogs',
	fields: {
    season: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerSeasonGameLogsLoader.load(p.id),
    },
    playoff: {
      type: new GraphQLList(PlayerStatistic),
      resolve: p => playerPlayoffsGameLogsLoader.load(p.id),
    },
	},
});

// Another file
const TeamInfo = new GraphQLObjectType({
	name: 'TeamInfo',
	fields: () => ({
  	id: { type: GraphQLInt, resolve: itself },
	}),
});

module.exports = new GraphQLObjectType({
  name: 'NHLPlayer',
  fields: {
  	id: { type: GraphQLInt, resolve: (p) => p.id },
    bio: { type: PlayerBio, resolve: itself },
    status: { type: PlayerStatus, resolve: itself },
    position: { type: PlayerPosition, resolve: itself },
    streak: { type: PlayerStreak, resolve: itself },
    draft: { type: PlayerDraft, resolve: itself },
    career: { type: PlayerCareer, resolve: itself },
    gameLogs: { type: PlayerGameLogs, resolve: itself },
    // team: {
    // 	type: TeamInfo,
    // 	resolve: p => playerBioLoader.load(p.id)
    // 		.then(resolvePath(['currentTeam', 'id']))
    // },
  },
})

// TODO: Implement $first and $last filters on game logs


/* test query
{
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