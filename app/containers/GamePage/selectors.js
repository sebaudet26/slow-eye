import { createSelector } from 'reselect';

const urlParams = new URLSearchParams(window.location.search);

export const selectHome = state => state.get('home');

export const makeSelectBoxscore = () => createSelector(
  selectHome,
  homeState => homeState.getIn(['boxscores', urlParams.get('id')]) || {},
);

export const makeSelectGameId = () => createSelector(
  () => urlParams.get('id'),
);
