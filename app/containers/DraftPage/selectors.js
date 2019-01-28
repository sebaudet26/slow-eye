import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectDrafts = () => createSelector(
  selectHome,
  homeState => homeState.getIn(['drafts']).toJS() || {},
);
