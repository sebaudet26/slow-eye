/* global fetch */
import graphqlApi from '../../../utils/api';

const makeDraftQuery = year => `
{
  draft (year: ${year}) {
    prospectId
    amateurClubName
    amateurLeague
    birthDate
    birthPlace
    countryCode
    csPlayerId
    year
    teamId
    firstName
    height
    lastName
    overallNumber
    inRoundNumber
    id
    name
    position
    removedOutright
    removedOutrightWhy
    round
    shootsCatches
    supplementalDraft
    pickedBy {
      id
      name
      abbreviation
    }
    weight
  }
}
`;

export const setLoading = () => async dispatch => dispatch({
  type: SET_LOADING,
  payload: {
    loading: true,
  },
});

export const fetchDraftForYear = year => async (dispatch) => {
  try {
    const data = await graphqlApi(makeDraftQuery(year));
    return dispatch({
      type: 'FETCH_DRAFT',
      payload: {
        year,
        data: data.draft,
      },
    });
  } catch (e) {
    return console.error(e.toString());
  }
};

export default null;
