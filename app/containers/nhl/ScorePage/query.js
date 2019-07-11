import { gql } from 'apollo-boost';
import moment from 'moment';

const getScoresQuery = gql`
  query Game($date: String) {
    games (date: $date){
      id,
      gameDate
          highlights {
            recap
          }
          liveFeed {
            lastTenPlays {
              period
              periodTimeRemaining
              periodType
              periodTime
              description
            }
          }
      status {
        abstractGameState
        codedGameState
        detailedState
        statusCode
      }
      seriesSummary {
        gameLabel
        seriesStatus
        seriesStatusShort
      }
      teams {
        away {
          score
          leagueRecord {
            wins
            losses
            ot
          }
          team {
            name
            id
            abbreviation
          }
        }
        home {
          score
          leagueRecord {
            wins
            losses
            ot
          }
          team {
            name
            id
            abbreviation
          }
        }
      }
    }
  }
`;

export {
  getScoresQuery,
};
