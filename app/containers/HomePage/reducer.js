import { fromJS } from 'immutable';
import { path, sortBy } from 'ramda';
import { FETCH_PLAYERS } from './constants';

const initialState = fromJS({
  sorts: {
    players: ['fullName'],
  },
});

function homeReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_PLAYERS:
      // Delete prefixed '@' from the github username
      return state.set('players', sortBy(path(['person', 'fullName']))(action.payload));
    default:
      return state;
  }
}

export default homeReducer;
