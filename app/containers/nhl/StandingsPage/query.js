import { gql } from 'apollo-boost';

const getStandingsQuery = gql`
query($season: String) {
  nhl {
    standings(season: $season) {
      season
      record {
        goalsAgainst
        goalsScored
        points
        conferencName
        divisionName
        isDivisionLeader
        isWildCard
        divisionRank
        conferenceRank
        leagueRank
        wildCardRank
        gamesPlayed
        streak
        record {
          wins
          losses
          ot
        }
        awayRecord {
          wins
          losses
          ot
        }
        homeRecord {
          wins
          losses
          ot
        }
        shootOutsRecord {
          wins
          losses
          ot
        }
        lastTenRecord{
          wins
          losses
          ot
        }
        teamId
        teamName
      }
    }
  }
}
`;

export { getStandingsQuery };
