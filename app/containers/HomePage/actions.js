/* global fetch */
import { FETCH_PLAYERS_STREAKS } from './constants';
import graphqlApi from '../../utils/api';

const makePlayersStreaksQuery = () => `
{
	playerStreaks {
    id
    name
    games
    goals
    assists
    points
    teamId
    positionCode
  }
}
`;

export const fetchPlayersStreaks = () => async (dispatch) => {
  try {
    const data = await graphqlApi(makePlayersStreaksQuery());
    return dispatch({
      type: FETCH_PLAYERS_STREAKS,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
