import {
  equals, isNil, or, path, pipe, prop,
} from 'ramda';

export const isScratched = pipe(prop('boxscore'), isNil);
export const isGoalie = pipe(path(['position', 'abbreviation']), equals('G'));
export const isScratchedOrGoalie = p => or(isGoalie(p), isScratched(p));
