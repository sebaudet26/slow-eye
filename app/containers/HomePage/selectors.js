import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectPlayersStreaks = () => createSelector(
  selectHome,
  homeState => homeState.get('playersStreaks') || [],
);
