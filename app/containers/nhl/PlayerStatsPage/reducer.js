import { fromJS } from 'immutable';
import { sortBy, prop } from 'ramda';
import { FETCH_PLAYERS, FETCH_TEAMS, SET_LOADING } from './constants';

const initialState = fromJS({
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      const newState = state.set('players', action.payload);
      return newState.set('loading', false);
    case FETCH_TEAMS:
      return state.set('teams', sortBy(prop('name'), action.payload));
    case SET_LOADING:
      return state.set('loading', true);
    default:
      return state;
  }
}

export default homeReducer;
