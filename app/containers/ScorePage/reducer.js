import { fromJS } from 'immutable';
import { FETCH_GAMES } from './constants';

const initialState = fromJS({
  games: {},
});

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GAMES:
      return state.setIn(['games', action.payload.date.replace(/-/g, '')], action.payload.games);
    default:
      return state;
  }
}

export default playerReducer;
