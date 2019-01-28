/* global fetch */
import { FETCH_DRAFT } from './constants';
import graphqlApi from '../../utils/api';

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
    teamPickHistory {
      id
      name
      abbreviation
    }
    triCode
    weight
  }
}
`;

export const fetchDraftForYear = year => async (dispatch) => {
  try {
    const data = await graphqlApi(makeDraftQuery(year));
    return dispatch({
      type: FETCH_DRAFT,
      payload: {
        year,
        data: data.draft,
      },
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
