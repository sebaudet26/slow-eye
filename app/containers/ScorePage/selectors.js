import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectGames = () => createSelector(
  selectHome,
  homeState => homeState.get('games') || [],
);
