/* global fetch */
import { FETCH_TEAM, FETCH_TEAM_ROSTER } from './constants';
import graphqlApi from '../../utils/api';

const makeTeamQuery = id => `
{
  team (id: ${id}) {
    id
    name
    link
    abbreviation
    teamName
    ranking {
      conference
      conferenceName
      division
      divisionName
      league
    }
    roster {
      id
    },
    stats {
      type
      splits {
        gamesPlayed
        wins
        losses
        ot
        pts
        ptPctg
        goalsPerGame
        goalsAgainstPerGame
        evGGARatio
        powerPlayPercentage
        powerPlayGoals
        powerPlayGoalsAgainst
        powerPlayOpportunities
        penaltyKillPercentage
        shotsPerGame
        shotsAllowed
        winScoreFirst
        winOppScoreFirst
        winLeadFirstPer
        winLeadSecondPer
        winOutshootOpp
        winOutshotByOpp
        faceOffsTaken
        faceOffsWon
        faceOffsLost
        faceOffWinPercentage
        shootingPctg
        savePctg
      }
    }
  }
}
`;

const makePlayerQuery = id => `
{
  player (id: ${id}) {
    id
    info {
      firstName
      lastName
      shootsCatches
      birthDate
      birthCity
      birthStateProvince
      birthCountry
      nationality
      height
      weight
      captain
      rookie
      fullName
      currentAge
      rosterStatus
      primaryNumber
      currentTeamInfo {
        name
        teamName
        abbreviation
      }
      primaryPosition {
        name
        abbreviation
      }
      draftInfo {
        year
        round
        pickOverall
        pickInRound
        team {
          name
          abbreviation
        }
      }
    }
    stats {
      season
      team {
        name
        abbreviation
      }
      league {
        name
      }
      stat {
        assists
        goals
        points
        games
        plusMinus
        shots
        shotPct
        hits
        pim
        blocked
        timeOnIcePerGame
        savePercentage
        goalsAgainst
        saves
        shutouts
        goalAgainstAverage
        powerPlayGoals
        shortHandedGoals
        gameWinningGoals
        gamesStarted
        wins
        losses
        ot
      }
    }
    logs (lastTen: true){
      date
      stat {
        points
        plusMinus
        timeOnIce
      }
    }
  }
}
`;

export const fetchTeamRosterDetails = (id, roster) => async (dispatch) => {
  try {
    const filledRoster = await Promise.all(roster.map(p => graphqlApi(makePlayerQuery(p.id), `player-${p.id}`)));
    return dispatch({
      type: FETCH_TEAM_ROSTER,
      payload: {
        id,
        roster: filledRoster,
      },
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export const fetchTeamById = id => async (dispatch) => {
  try {
    const data = await graphqlApi(makeTeamQuery(id));
    return dispatch({
      type: FETCH_TEAM,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
