import { fromJS } from 'immutable';
import { FETCH_WILDCARD_STANDINGS } from './constants';

const initialState = fromJS({
});

initialState.set('standings', []);

function standingsReducer(state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case FETCH_WILDCARD_STANDINGS:
      return state.set('standings', action.payload.standings);
    default:
      return state;
  }
}

export default standingsReducer;
