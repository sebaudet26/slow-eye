import { gql } from 'apollo-boost';

// This is a bad query, please refactor Seb
const getScoresQuery = gql`
  query($date: String, $y1date: String, $y2date: String, $y3date: String, $n1date: String, $n2date: String, $n3date: String) {
    currentDate: games (date: $date){
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
    y1date: games(date: $y1date) {
      gameDate
    }
    y2date: games(date: $y2date) {
      gameDate
    }
    y3date: games(date: $y3date) {
      gameDate
    }
    n1date: games(date: $n1date) {
      gameDate
    }
    n2date: games(date: $n2date) {
      gameDate
    }
    n3date: games(date: $n3date) {
      gameDate
    }
  }
`;

export {
  getScoresQuery,
};
