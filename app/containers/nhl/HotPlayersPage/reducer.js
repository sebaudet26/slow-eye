import { fromJS } from 'immutable';
import { FETCH_HOT_PLAYERS } from './constants';

const initialState = fromJS({
});

initialState.set('hotPlayers', []);

function streaksReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_HOT_PLAYERS:
      return state.set('hotPlayers', action.payload.playerStreaks);
    default:
      return state;
  }
}

export default streaksReducer;
