import { fromJS } from 'immutable';
import { FETCH_TODAYS_GAMES } from './constants';

const initialState = fromJS({
});

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TODAYS_GAMES:
      return state.set('games', action.payload.games);
    default:
      // return state.set('players', playersMock);
      return state;
  }
}

export default playerReducer;
