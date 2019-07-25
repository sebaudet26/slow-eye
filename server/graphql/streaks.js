
const {
  take, pipe, map, path, sum,
} = require('ramda');

const timeOnIceToSeconds = timeOneIceString => (
  Number(timeOneIceString.split(':')[0]) * 60 + Number(timeOneIceString.split(':')[1])
);

const hotColdGames = 10;
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

const getPointsInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'points'])),
  sum,
);

const getSecondsPlayedInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'timeOnIce'])),
  map(timeOnIceToSeconds),
  sum,
);

const cumulativePlusMinusInLastGames = pipe(
  take(hotColdGames),
  map(path(['stat', 'plusMinus'])),
  sum,
);

const isHot = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) >= pointsPerThousandSecondsToBeHot[pos];
};

const isCold = (gameLogs, pos) => {
  const secondInLastGames = getSecondsPlayedInLastGames(gameLogs);
  return (
    (getPointsInLastGames(gameLogs) / secondInLastGames * 1000) <= pointsPerThousandSecondsToBeCold[pos]
    && (pos === 'D' ? cumulativePlusMinusInLastGames(gameLogs) < plusMinusColdThreshold : true)
  );
};

module.exports = {
  isHot,
  isCold,
}
