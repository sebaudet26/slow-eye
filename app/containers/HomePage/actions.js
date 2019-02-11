/* global fetch */
import { FETCH_PLAYERS_STREAKS, FETCH_TEAMS_STREAKS } from './constants';
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

const makeTeamsStreaksQuery = () => `
{
	teamsStreaks {
    id
    teamName
    abbreviation
    wins
    losses
    ot
    games
    points
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

export const fetchTeamsStreaks = () => async (dispatch) => {
  try {
    const data = await graphqlApi(makeTeamsStreaksQuery());
    return dispatch({
      type: FETCH_TEAMS_STREAKS,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
