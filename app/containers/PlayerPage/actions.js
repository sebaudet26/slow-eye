/* global fetch */
import { FETCH_PLAYER_BY_ID } from './constants';
import graphqlApi from '../../utils/api';

const makePlayerQuery = id => `
{
  player (id: ${id}) {
    info {
      firstName,
      lastName,
      shootsCatches,
      birthDate,
      birthCity,
      birthStateProvince,
      birthCountry,
      nationality,
      height,
      weight,
      captain,
      rookie,
      fullName,
      currentAge,
      rosterStatus,
      currentTeamInfo {
        name,
        teamName,
        abbreviation
      },
      primaryPosition {
        name,
        abbreviation
      },
      draftInfo {
        year,
        round,
        pickOverall,
        pickInRound,
        team {
          name
        }
      }
    },
    stats {
      season,
      team {
        name
        abbreviation
      },
      league {
        name
      },
      stat {
        assists,
        goals,
        points,
        games,
        plusMinus,
        shots,
        shotPct,
        hits,
        pim,
        blocked,
        timeOnIcePerGame
      }
    },
    logs {
      date,
      stat {
        points,
        plusMinus
      }
    }
  }
}
`;

export const fetchPlayer = id => async (dispatch) => {
  try {
    const data = await graphqlApi(makePlayerQuery(id), `player-${id}`);
    console.log('data', data);
    return dispatch({
      type: FETCH_PLAYER_BY_ID,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
