/* global fetch */
import graphqlApi from '../../../utils/api';

const makeTeamsStreaksQuery = () => `
{
	teamsStreaks (limit: 31) {
    id
    teamName
    name
    abbreviation
    wins
    losses
    ot
    games
    points
    goalsFor
    goalsAgainst
  }
}
`;

export const fetchTeamsStreaks = () => async (dispatch) => {
  try {
    const data = await graphqlApi(makeTeamsStreaksQuery());
    return dispatch({
      type: 'FETCH_TEAMS_STREAKS',
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
