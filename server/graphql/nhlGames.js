const { last } = require('ramda');
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

const calculateGameTime = (lastEvent) => {
  if (!lastEvent) {
    return 'Starting Soon';
  }
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

const getStatusText = (status, liveFeed, gameDate) => {
  const statusCode = status
    ? status.codedGameState
    : liveFeed.status.codedGameState;

  switch (statusCode) {
    case '1':
      return `${moment(gameDate).format('h:mm A')}`;
    case '3':
      return `${calculateGameTime(last(liveFeed.lastTenPlays))}`;
    case '4':
      return `${calculateGameTime(last(liveFeed.lastTenPlays))}`;
    default:
      return '';
  }
};

const getFinalPeriod = (lastTenPlays) => {
  if (
    !lastTenPlays
    || !lastTenPlays.length
    || !last(lastTenPlays).about
  ) {
    return '';
  }

  switch (last(lastTenPlays).about.period) {
    case 3:
      return '';
    case 4:
      return '(OT)';
    case 5:
      return '(S/O)';
    default:
      return '';
  }
};

module.exports = { getStatusText, getFinalPeriod };
