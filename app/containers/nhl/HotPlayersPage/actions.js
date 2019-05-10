/* global fetch */
import { FETCH_HOT_PLAYERS } from './constants';
import graphqlApi from '../../../utils/api';

const makePlayersStreaksQuery = () => `
{
	playerStreaks (limit: 100) {
    id
    name
    games
    goals
    assists
    points
    plusMinus
    shots
    teamId
    positionCode
    pim
    powerPlayPoints
    shots
    hits
  }
}
`;

export const fetchPlayersStreaks = () => async (dispatch) => {
  try {
    const data = await graphqlApi(makePlayersStreaksQuery());
    console.log(data);
    return dispatch({
      type: FETCH_HOT_PLAYERS,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
