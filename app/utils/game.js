import { last } from 'ramda';
import moment from 'moment';
import { toOrdinal } from './misc';

// export const gameStatusLabels = {
//   1: 'Scheduled',
//   2: 'Pregame',
//   3: 'Live',
//   4: 'OT',
//   6: 'Final/OT',
//   7: 'Final',
// };

export const isScheduled = game => game.status.detailedState === 'Scheduled';

export const calculateGameTime = (lastEvent) => {
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

export const getStatusText = (game) => {
  const statusCode = game.status
    ? game.status.codedGameState
    : game.liveFeed.status.codedGameState;

  switch (statusCode) {
    case '1':
      return `${moment(game.gameDate).format('h:mm A')}`;
    case '3':
      return `${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    case '4':
      return `${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    default:
      return '';
  }
};

export const getFinalPeriod = (game) => {
  if (
    !game.liveFeed
    || !game.liveFeed.lastTenPlays
    || !game.liveFeed.lastTenPlays.length
    || !last(game.liveFeed.lastTenPlays).period
  ) {
    return '';
  }

  switch (last(game.liveFeed.lastTenPlays).period) {
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

export default null;
