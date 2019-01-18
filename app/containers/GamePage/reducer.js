import { fromJS } from 'immutable';
import { FETCH_GAME_BOXSCORE } from './constants';

const initialState = fromJS({
});

function gameBoxscoreReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_GAME_BOXSCORE:
      return state.setIn(['boxscores', action.payload.game.id], action.payload.game);
    default:
      return state;
  }
}

export default gameBoxscoreReducer;
