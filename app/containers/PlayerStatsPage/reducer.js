import { fromJS } from 'immutable';
import { sortBy, prop } from 'ramda';
import { FETCH_PLAYERS, FETCH_TEAMS } from './constants';

const initialState = fromJS({
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return state.set('players', action.payload);
    case FETCH_TEAMS:
      return state.set('teams', sortBy(prop('name'), action.payload));
    default:
      return state;
  }
}

export default homeReducer;
