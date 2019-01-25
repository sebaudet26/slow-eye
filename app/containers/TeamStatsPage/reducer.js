import { fromJS } from 'immutable';
import { FETCH_TEAMS } from './constants';

const initialState = fromJS({
});

initialState.set('teams', []);

function teamsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS:
      return state.set('teams', action.payload.teams);
    default:
      return state;
  }
}

export default teamsReducer;
