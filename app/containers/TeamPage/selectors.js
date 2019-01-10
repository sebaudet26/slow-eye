import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectTeam = () => createSelector(
  selectHome,
  homeState => (homeState.get('teams') ? homeState.get('teams').toJS() : {}),
);

export const makeSelectTeamRoster = () => createSelector(
  selectHome,
  homeState => (homeState.get('rosters') ? homeState.get('rosters').toJS() : {}),
);
