import {
  equals, isNil, map, or, path, pipe, prop, sum, filter,
} from 'ramda';

export const isScratched = pipe(prop('boxscore'), isNil);
export const isGoalie = pipe(path(['position', 'abbreviation']), equals('G'));
export const isScratchedOrGoalie = p => or(isGoalie(p), isScratched(p));
export const pointsInLatestSeason = player => (
  player.stats.length
    ? player.stats[player.stats.length - 1].stat.points
    : 0
);
export const gamesPlayedLatestSeason = player => (
  player.stats.length
    ? player.stats[player.stats.length - 1].stat.games
    : 0
);
export const positionIs = pos => player => (
  player.stats.length
    ? player.info.primaryPosition.abbreviation === pos
    : 0
);
export const shootingSideIs = side => player => (
  player.stats.length
    ? player.info.shootsCatches === side
    : 0
);

export const sumNumbers = (data, pathToNumber) => pipe(
  map(path(pathToNumber)),
  filter(val => typeof val === 'number'),
  arr => (arr.length ? sum(arr) : '-'),
)(data);

export const forwardsAbbreviations = ['LW', 'C', 'RW'];
