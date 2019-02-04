import { fromJS } from 'immutable';
import { FETCH_DRAFT } from './constants';

const initialState = fromJS({
});

initialState.set('drafts', {});

function draftsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DRAFT:
      return state.setIn(['drafts', action.payload.year], action.payload.data);
    default:
      return state;
  }
}

export default draftsReducer;
