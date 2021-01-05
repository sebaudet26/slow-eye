import { gql } from 'apollo-boost';


// Nest Player Object Type in Roster Of Team Query
const getTeamQuery = gql`
query($id: Int) {
  nhl {
    team (id: $id) {
      id
      wins
      losses
      ot
      gamesPlayed
      divisionRank
      conferenceRank
      leagueRank
      teamName
      active
      goalsForPerGame
      goalsAgainstPerGame
      powerPlayPercentage
      penaltyKillPercentage
      roster {
        id
        name
        jerseyNumber
        position
        shootsCatches
        primaryNumber
        currentAge
        birthDate
        height
        weight
        birthCity
        nationality
        draftYear
        draftTeam
        draftPick
        draftRound
      }
    }
  }
}
`;

export { getTeamQuery };
