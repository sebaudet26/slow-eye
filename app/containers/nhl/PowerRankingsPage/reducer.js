import { fromJS } from 'immutable';
import { FETCH_TEAMS_STREAKS } from './constants';

const initialState = fromJS({
});

initialState.set('teamsStreaks', []);

function streaksReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS_STREAKS:
      return state.set('teamsStreaks', action.payload.teamsStreaks);
    default:
      return state;
  }
}

export default streaksReducer;
