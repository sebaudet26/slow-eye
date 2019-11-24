import { gql } from 'apollo-boost';

const getStreaksQuery = gql`
  query {
    nhl {
      streaks {
        players {
          id
          name
          games
          goals
          assists
          points
        }
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
`;

export { getStreaksQuery };
