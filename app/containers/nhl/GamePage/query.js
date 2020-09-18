import { gql } from 'apollo-boost';

const getGameQuery = gql`
query($id: Int) {
  nhl {
    game (id: $id) {
      recap
      statusText
      lastEventPeriod
      penalties {
        teamId
        teamName
        description
        minutes
        periodNumber
        periodTime
        type
        player {
          id
          name
        }
      }
      goals {
        teamId
        teamName
        description
        isGameWinningGoal
        periodNumber
        periodTime
        periodDescription
        videoLink
        scoreAway
        scoreHome
        emptyNet
        strength
        scorer {
          id
          name
          seasonTotal
        }
        assists {
          id
          name
          seasonTotal
        }
      }
      awayTeam {
        wins
        losses
        ot
        pts
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
        wins
        losses
        ot
        pts
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
`;

export { getGameQuery };
