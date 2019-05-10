import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectTeamsStreaks = () => createSelector(
  selectHome,
  homeState => homeState.get('teamsStreaks') || [],
);
