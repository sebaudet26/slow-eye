import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectTeam = () => createSelector(
  selectHome,
  homeState => (homeState.get('teams') ? homeState.get('teams').toJS() : {}),
);
