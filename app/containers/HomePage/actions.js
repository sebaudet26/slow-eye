/* global fetch */

import { FETCH_PLAYERS } from './constants';


export const fetchPlayers = () => async (dispatch) => {
  const requestURL = 'https://statsapi.web.nhl.com/api/v1/teams/5/roster';
  const apiResponse = await fetch(requestURL);
  const json = await apiResponse.json();
  return dispatch({
    type: FETCH_PLAYERS,
    payload: json,
  });
};
export default null;
