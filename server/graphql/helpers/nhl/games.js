const { last, pathOr, pipe, takeLast } = require('ramda');
const moment = require('moment');

const toOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// export const gameStatusLabels = {
//   1: 'Scheduled',
//   2: 'Pregame',
//   3: 'Live',
//   4: 'OT',
//   6: 'Final/OT',
//   7: 'Final',
// };

const isScheduled = game => game.status.detailedState === 'Scheduled';

const getDateString = game => moment(game.gameDate).format('YYYY-MM-DD')

const calculateGameTime = (lastEventObject) => {
  if (!lastEventObject) {
    return 'Starting Soon';
  }
  const lastEvent = lastEventObject.about;
  if (lastEvent.periodTimeRemaining === '00:00') {
    return `${toOrdinal(lastEvent.period)} Intermission`;
  }
  if (lastEvent.period === 1) {
    return `${lastEvent.period}st Period - ${lastEvent.periodTimeRemaining}`;
  }
  if (lastEvent.period === 2) {
    return `${lastEvent.period}nd Period - ${lastEvent.periodTimeRemaining}`;
  }
  if (lastEvent.period === 3) {
    return `${lastEvent.period}rd Period - ${lastEvent.periodTimeRemaining}`;
  }
  if (lastEvent.period === 4) {
    return `Overtime ${lastEvent.periodTimeRemaining}`;
  }
  return `${lastEvent.period} - ${lastEvent.periodTimeRemaining}`;
};

const getStatusText = (game, liveFeed) => {
  const statusCode = game.status.statusCode

  const lastTenPlays = pipe(
    pathOr([], ['liveData', 'plays', 'allPlays']),
    takeLast(10),
  )(liveFeed)

  switch (statusCode) {
    case '1':
      return `Scheduled at ${moment(game.gameDate).format('h:mm A')} (EST)`;
    case '3':
      return `${calculateGameTime(last(lastTenPlays))}`;
    case '4':
      return `${calculateGameTime(last(lastTenPlays))}`;
    case '7': 
      return ['Final', getFinalPeriod(lastTenPlays, game.gameType == 'P')].join(' ')
    default:
      return '';
  }
};

const getFinalPeriod = (lastTenPlays, isPlayoff) => {
  if (
    !lastTenPlays
    || !lastTenPlays.length
    || !last(lastTenPlays).about
  ) {
    return null;
  }

  if (isPlayoff) {
    switch (last(lastTenPlays).about.period) {
      case 4:
        return '(OT)';
      case 5:
        return '(2OT)';      
      case 5:
        return '(3OT)';      
      case 5:
        return '(4OT)';
      default:
        return null;
    }
  } else {
    switch (last(lastTenPlays).about.period) {
      case 3:
        return '';
      case 4:
        return '(OT)';
      case 5:
        return '(S/O)';
      default:
        return null;
    }
  }
};

module.exports = { isScheduled, getStatusText, getFinalPeriod, getDateString };
