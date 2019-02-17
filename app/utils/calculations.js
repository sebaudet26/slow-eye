import {
  reject,
  isNil,
  take,
  map,
  path,
  sum,
  pathOr,
  pipe,
  prop,
} from 'ramda';
import {
  timeOnIceToSeconds,
} from './misc';

export const hotColdGames = 10;
const pointsPerThousandSecondsToBeCold = {
  C: 0.25,
  LW: 0.25,
  RW: 0.25,
  D: 0.16,
};
const pointsPerThousandSecondsToBeHot = {
  C: 0.9,
  LW: 0.9,
  RW: 0.9,
  D: 0.5,
};
const plusMinusColdThreshold = -5;
const veteranGames = 500;

export const getPointsInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'points'])),
  sum,
);

export const getSecondsPlayedInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'timeOnIce'])),
  map(timeOnIceToSeconds),
  sum,
);

export const cumulativePlusMinusInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'plusMinus'])),
  sum,
);

export const isHot = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) >= pointsPerThousandSecondsToBeHot[pos];
};

export const isCold = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (
    (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) <= pointsPerThousandSecondsToBeCold[pos]
    && (pos === 'D' ? cumulativePlusMinusInLastGames(gameLogs) < plusMinusColdThreshold : true)
  );
};

export const isInjured = info => info.rosterStatus === 'I';
export const isVeteran = stats => sum(map(pathOr(0, ['stat', 'games']), stats)) > veteranGames;
