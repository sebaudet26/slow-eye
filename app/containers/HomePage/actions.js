/* global fetch */
import { FETCH_PLAYERS } from './constants';
import graphqlApi from '../../utils/api';

const allPlayers = `
{
  players {
    id,
    person {
      fullName
    },
    team {
      abbreviation
    },
    position {
      abbreviation
    },
    info {
      nationality
    },
    stats {
      season,
      stat {
        games,
        goals,
        points,
        assists,
        plusMinus,
        pim,
        hits,
        blocked,
        shots,
        shotPct
      }
    }
  }
}`;

export const fetchAllPlayers = () => async (dispatch) => {
  try {
    const data = await graphqlApi(allPlayers, 'allPlayers');
    console.log(data);
    return dispatch({
      type: FETCH_PLAYERS,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
