import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectDrafts = () => createSelector(
  selectHome,
  homeState => (homeState.getIn(['drafts']) ? homeState.getIn(['drafts']).toJS() : {}),
);

export const makeSelectLoading = () => createSelector(
  selectHome,
  homeState => homeState.getIn(['loading']),
);
