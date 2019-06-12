import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectPlayer = () => createSelector(
  selectHome,
  homeState => homeState.get('player') || {},
);
