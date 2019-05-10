import { fromJS } from 'immutable';
import { FETCH_DRAFT, SET_LOADING } from './constants';

const initialState = fromJS({
});

initialState.set('drafts', {});
initialState.set('loading', false);

function draftsReducer(state = initialState, action) {
  console.log(state);
  console.log(action.type);
  switch (action.type) {
    case FETCH_DRAFT:
      const newState = state.setIn(['drafts', action.payload.year], action.payload.data);
      return newState.set('loading', false);
    case SET_LOADING:
      return state.set('loading', true);
    default:
      return state;
  }
}

export default draftsReducer;
