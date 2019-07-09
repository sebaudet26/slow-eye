/* global fetch */
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
      type: 'FETCH_HOT_PLAYERS',
      payload: data,
    });
  } catch (e) {
    return console.error(e.toString());
  }
};

export default null;
