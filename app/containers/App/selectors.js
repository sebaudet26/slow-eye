/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRoute = state => state.get('route');

const makeSelectLoading = () => createSelector(
  selectGlobal,
  globalState => globalState.get('loading'),
);

const makeSelectLeague = () => createSelector(
  selectGlobal,
  globalState => globalState.get('selectedLeague'),
);


const makeSelectError = () => createSelector(
  selectGlobal,
  globalState => globalState.get('error'),
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  routeState => routeState.get('location').toJS(),
);

const makeSelectFeatures = () => createSelector(
  selectGlobal,
  globalState => globalState.get('features'),
);

export {
  selectGlobal,
  makeSelectFeatures,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
};
