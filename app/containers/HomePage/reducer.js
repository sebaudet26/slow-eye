import { fromJS } from 'immutable';
import { FETCH_PLAYERS_STREAKS } from './constants';

const initialState = fromJS({
});

initialState.set('playerStreaks', []);

function streaksReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS_STREAKS:
      return state.set('playersStreaks', action.payload.playerStreaks);
    default:
      return state;
  }
}

export default streaksReducer;
