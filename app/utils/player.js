import {
  equals, isNil, map, or, path, pipe, prop, sum, filter, length, pathOr, some,
} from 'ramda';

export const isScratched = pipe(prop('timeOnIce'), isNil);
export const isGoalie = pipe(path(['position']), equals('G'));
export const isScratchedOrGoalie = p => or(isGoalie(p), isScratched(p));

export const sumNumbers = (data, pathToNumber) => pipe(
  map(path(pathToNumber)),
  filter(val => typeof val === 'number'),
  arr => (arr.length ? sum(arr) : '-'),
)(data);

export const isPosGoalie = pos => pos === 'G';

export const isActiveThisYear = latestSeason => latestSeason.season === '20192020';

export const sumStatsByPath = ({
  active, stats, pathToNumber,
}) => {
  if (active) {
    let fullLastSeason = 0;
    if (!isActiveThisYear(stats[stats.length - 1])) {
      return fullLastSeason;
    }
    let index = stats.length - 1;
    while (
      stats[index] &&
      (stats[stats.length - 1].season == stats[index].season)
    ) {
      fullLastSeason += path(pathToNumber, stats[index]);
      index -= 1;
    }
    return fullLastSeason;
  }
  return sumNumbers(stats, pathToNumber);
};
