import { gql } from 'apollo-boost';

const getStandingsQuery = gql`
{
  standings {
    type
    conference {
      name
    }
    division {
      name
    }
    teamRecords {
      records {
        overallRecords {
          wins
          losses
          ot
          type
        }
      }
      gamesPlayed
      goalsScored
      goalsAgainst
      conferenceRank
      divisionRank
      wildCardRank
      leagueRecord {
        wins
        losses
        ot
      }
      streak {
        code
      }
      points
      team {
        id
        name
        abbreviation
      }
      records {
        overallRecords {
          type
          wins
          losses
          ot
        }
      }
    }
  }
}
`;

export { getStandingsQuery };
