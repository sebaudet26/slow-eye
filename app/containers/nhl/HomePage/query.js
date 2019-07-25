import { gql } from 'apollo-boost';

const getStreaksQuery = gql`
  {
  	playerStreaks (limit: 5) {
      id
      name
      games
      goals
      assists
      points
      teamId
      positionCode
    }
    teamsStreaks (limit: 10) {
      id
      teamName
      abbreviation
      wins
      losses
      ot
      games
      points
    }
  }
`;

export { getStreaksQuery };
