import { fromJS } from 'immutable';
import { FETCH_PLAYERS } from './constants';

const initialState = fromJS({
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return state.set('players', action.payload);
    default:
      return state;
  }
}

export default homeReducer;
