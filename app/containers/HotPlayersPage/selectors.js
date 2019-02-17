import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectHotPlayers = () => createSelector(
  selectHome,
  homeState => homeState.get('hotPlayers') || [],
);
