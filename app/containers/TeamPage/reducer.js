import { fromJS } from 'immutable';
import { FETCH_TEAM, FETCH_TEAM_ROSTER } from './constants';

const initialState = fromJS({
});

initialState.set('teams', {});
initialState.set('rosters', {});

function teamsReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_TEAM:
      return state.setIn(['teams', action.payload.team.id], action.payload.team);
    case FETCH_TEAM_ROSTER:
      return state.setIn(['rosters', action.payload.id], action.payload.roster);
    default:
      return state;
  }
}

export default teamsReducer;
