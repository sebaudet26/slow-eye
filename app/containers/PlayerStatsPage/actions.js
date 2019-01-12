/* global fetch */
import { FETCH_PLAYERS } from './constants';
import graphqlApi from '../../utils/api';

const makeQuery = season => `
{
  players ${season ? `(season: "${season}")` : ''} {
    id,
    person {
      fullName
    },
    team {
      id
      abbreviation
    },
    position {
      abbreviation
    },
    info {
      nationality
    },
    stats ${season ? `(season: "${season}")` : ''}{
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
        shotPct,
        saves,
        shutouts,
        gamesStarted,
        timeOnIce,
        savePercentage,
        goalAgainstAverage,
        gamesStarted,
        wins,
        losses,
        ot
      }
    }
  }
}`;

export const fetchAllPlayers = season => async (dispatch) => {
  try {
    const data = await graphqlApi(makeQuery(season || '20182019'));
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
