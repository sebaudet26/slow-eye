import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectTeamsStats = () => createSelector(
  selectHome,
  homeState => homeState.get('teams') || [],
);
