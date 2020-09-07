import { gql } from 'apollo-boost';

const getScoresQuery = gql`
  query($dates: [String]) {
    nhl {
      schedule (dates: $dates) {
        id
        type
        recap
        isScheduled
        statusText
        currentPeriod
        currentPeriodTime
        seriesSummary
        season
        dateString
        dateTime
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
`;

export {
  getScoresQuery,
};
