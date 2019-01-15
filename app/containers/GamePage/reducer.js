import { fromJS } from 'immutable';
import { FETCH_GAME_BOXSCORE } from './constants';

const initialState = fromJS({
});

function gameBoxscoreReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GAME_BOXSCORE:
      return state.set('gameBoxscore', action.payload.game);
    default:
      // return state.set('players', playersMock);
      return state;
  }
}

export default gameBoxscoreReducer;
