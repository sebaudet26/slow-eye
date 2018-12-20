import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectStandings = () => createSelector(
  selectHome,
  homeState => homeState.get('standings') || [],
);
