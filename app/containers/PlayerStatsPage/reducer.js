import { fromJS } from 'immutable';
import { path, sortBy } from 'ramda';
import { FETCH_PLAYERS } from './constants';
// import playersMock from './mock';

const initialState = fromJS({
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return state.set('players', sortBy(path(['person', 'fullName']))(action.payload.players));
    default:
      // return state.set('players', playersMock);
      return state;
  }
}

export default homeReducer;
