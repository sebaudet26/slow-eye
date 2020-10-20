import { gql } from 'apollo-boost';


// Nest Player Object Type in Roster Of Team Query
const getTeamQuery = gql`
query($id: Int) {
  nhl {
    team (id: $id) {
      id
      wins
      losses
      gamesPlayed
      teamName
      active
      roster {
        id
        name
        jerseyNumber
        position
      }
    }
  }
}
`;

export { getTeamQuery };
