/* global fetch window */
import { FETCH_PLAYERS } from './constants';

const graphqlApiUrl = `${window.location.origin}/graphql`;


const graphqlApi = async (resource) => {
  try {
    const query = `
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
    const response = await fetch(graphqlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });
    const json = await response.json();
    const { data } = json;
    return data;
  } catch (e) {
    console.error(e.toString());
    throw new Error(e.toString());
  }
};

export const fetchAllPlayers = () => async (dispatch) => {
  try {
    const data = await graphqlApi('players');
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
