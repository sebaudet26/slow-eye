import { createSelector } from 'reselect';

export const selectHome = state => state.get('home');

export const makeSelectPlayers = () => createSelector(
  selectHome,
  homeState => homeState.get('players') || [],
);

export const makeSelectTeams = () => createSelector(
  selectHome,
  homeState => homeState.get('teams') || [],
);

export const makeSelectLoading = () => createSelector(
  selectHome,
  homeState => homeState.getIn(['loading']),
);
