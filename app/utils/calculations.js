import {
  take, map, path, sum, pathOr,
} from 'ramda';

export const hotColdGames = 5;
const pointsPerMatchThresholdForHot = 1.4;
const pointsPerMatchThresholdForCold = 0.2;
const pointsToBeHot = hotColdGames * pointsPerMatchThresholdForHot;
const pointsToBeCold = hotColdGames * pointsPerMatchThresholdForCold;
const veteranGames = 500;

export const pointsInLastGames = gameLogs => sum(map(path(['stat', 'points']), take(hotColdGames, gameLogs)));

export const isHot = gameLogs => pointsInLastGames(gameLogs) >= pointsToBeHot;
export const isCold = gameLogs => pointsInLastGames(gameLogs) <= pointsToBeCold;
export const isInjured = info => info.rosterStatus === 'I';
export const isVeteran = stats => sum(map(pathOr(0, ['stat', 'games']), stats)) > veteranGames;
