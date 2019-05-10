import { fromJS } from 'immutable';
import { FETCH_PLAYER_BY_ID } from './constants';

const initialState = fromJS({
});

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYER_BY_ID:
      return state.set('player', action.payload.player);
    default:
      // return state.set('players', playersMock);
      return state;
  }
}

export default playerReducer;
