import { fromJS } from 'immutable';
import { FETCH_TEAMS_STATS } from './constants';

const initialState = fromJS({
});

initialState.set('teamsStats', []);

function teamsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS_STATS:
      return state.set('teamsStats', action.payload.teams);
    default:
      return state;
  }
}

export default teamsReducer;
