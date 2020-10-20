import { gql } from 'apollo-boost';

const getPlayersQuery = gql`
query($season: String) {
  nhl {
    leaders (season: $season) {
      players {
        playerNationality
        playerBirthDate
        playerName
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
        savePercentage
        goalsAgainstAverage
      }
    }

    teams (season: "20192020") {
      id
      abbreviation
      name
    }
  }
}`;

export {
  getPlayersQuery,
};
