import {
  equals, isNil, map, or, path, pipe, prop, sum, filter, length, pathOr, some,
} from 'ramda';

export const isScratched = pipe(prop('boxscore'), isNil);
export const isGoalie = pipe(path(['position', 'abbreviation']), equals('G'));
export const isScratchedOrGoalie = p => or(isGoalie(p), isScratched(p));

export const sumNumbers = (data, pathToNumber) => pipe(
  map(path(pathToNumber)),
  filter(val => typeof val === 'number'),
  arr => (arr.length ? sum(arr) : '-'),
)(data);

export const isPosGoalie = pos => pos === 'G';

export const isActiveThisYear = latestSeason => latestSeason.season === '20182019';

export const sumStatsByPath = ({
  active, lastSeason, careerStats, pathToNumber,
}) => {
  if (active) {
    let fullLastSeason = 0;
    if (!isActiveThisYear(careerStats[careerStats.length - 1])) {
      return fullLastSeason;
    }
    let index = careerStats.length - 1;
    while (
      careerStats[index] &&
      (careerStats[careerStats.length - 1].season == careerStats[index].season)
    ) {
      fullLastSeason += path(pathToNumber, careerStats[index]);
      index -= 1;
    }
    return fullLastSeason;
  }
  return sumNumbers(careerStats, pathToNumber);
};

export const hasNHLExperience = careerStats => !!careerStats
  .filter(seasonStat => seasonStat.league.name === 'National Hockey League').length;
