import { FETCH_FEATURES } from './constants';

export const fetchFeatureFlags = () => async (dispatch) => {
  try {
    console.log('fetchFeatureFlags');
    const response = await fetch(`${window.origin}/features`);
    const data = await response.json();
    return dispatch({
      type: FETCH_FEATURES,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};
