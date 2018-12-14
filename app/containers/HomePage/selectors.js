import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectPlayers = () => createSelector(
  selectHome,
  homeState => homeState.get('players') || [],
);
