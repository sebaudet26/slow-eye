import { FETCH_FEATURES } from './constants';

export const fetchFeatureFlags = () => async (dispatch) => {
  try {
    console.log('fetchFeatureFlags', `${window.origin}/graphql/features`);
    const response = await fetch(`${window.origin}/graphql/features`);
    console.log(response);
    const data = await response.json();
    console.log(data);
    return dispatch({
      type: FETCH_FEATURES,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};
