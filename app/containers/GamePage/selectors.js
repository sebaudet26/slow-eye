import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectBoxscore = () => createSelector(
  selectHome,
  homeState => homeState.get('gameBoxscore') || {},
);
