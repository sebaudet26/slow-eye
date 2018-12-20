import {
  take, map, path, sum, pathOr,
} from 'ramda';

export const hotColdGames = 5;
const pointsPerMatchThresholdForHot = {
  C: 1.25,
  LW: 1.25,
  RW: 1.25,
  D: 0.75,
  G: 0.25,
};
const pointsPerMatchThresholdForCold = {
  C: 0.20,
  LW: 0.20,
  RW: 0.20,
  D: 0.25,
};
const plusMinusColdThreshold = -3;
const pointsToBeHot = pos => hotColdGames * pointsPerMatchThresholdForHot[pos];
const pointsToBeCold = pos => hotColdGames * pointsPerMatchThresholdForCold[pos];
const veteranGames = 500;

export const pointsInLastGames = gameLogs => sum(map(path(['stat', 'points']), take(hotColdGames, gameLogs)));
export const cumulativePlusMinusInLastGames = gameLogs => sum(map(path(['stat', 'plusMinus']), take(hotColdGames, gameLogs)));

export const isHot = (gameLogs, pos) => pointsInLastGames(gameLogs) >= pointsToBeHot(pos);
export const isCold = (gameLogs, pos) => {
  console.log(pointsInLastGames(gameLogs) <= pointsToBeCold(pos));
  console.log(cumulativePlusMinusInLastGames(gameLogs));
  console.log((pos === 'D' ? cumulativePlusMinusInLastGames(gameLogs) < plusMinusColdThreshold : true));
  return (pointsInLastGames(gameLogs) <= pointsToBeCold(pos)
  && (pos === 'D' ? cumulativePlusMinusInLastGames(gameLogs) < plusMinusColdThreshold : true));
};
export const isInjured = info => info.rosterStatus === 'I';
export const isVeteran = stats => sum(map(pathOr(0, ['stat', 'games']), stats)) > veteranGames;
