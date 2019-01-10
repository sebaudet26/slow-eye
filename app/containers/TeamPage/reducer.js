import { fromJS } from 'immutable';
import { FETCH_TEAM } from './constants';

const initialState = fromJS({
});

initialState.set('teams', {});

function teamsReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_TEAM:
      return state.setIn(['teams', action.payload.team.id], action.payload.team);
    default:
      return state;
  }
}

export default teamsReducer;
