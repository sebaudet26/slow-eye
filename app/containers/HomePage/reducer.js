/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';
import { FETCH_PLAYERS } from './constants';

const initialState = fromJS({

});

function homeReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_PLAYERS:
      // Delete prefixed '@' from the github username
      return state.set('players', action.payload);
    default:
      return state;
  }
}

export default homeReducer;
