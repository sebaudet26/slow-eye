import { last } from 'ramda';
import moment from 'moment';

export const gameStatusLabels = {
  1: 'Scheduled',
  3: 'Live',
  4: 'OT',
  6: 'Final/OT',
  7: 'Final',
};

export const isScheduled = game => game.status.detailedState === 'Scheduled';

export const calculateGameTime = (lastEvent) => {
  if (!lastEvent) {
    return 'Starting Soon';
  }
  if (lastEvent.period === 4) {
    return `Overtime, ${lastEvent.periodTime}`;
  }
  return `Period ${lastEvent.period}, ${lastEvent.periodTime}`;
};

export const getStatusText = (game) => {
  const statusCode = game.status
    ? game.status.codedGameState
    : game.liveFeed.status.codedGameState;

  switch (statusCode) {
    case '1':
      return `Scheduled ${moment(game.gameDate).format('h:mm')} PM`;
    case '3':
      return `Live - ${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    case '4':
      return `Live - ${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    case '6':
      return 'Final/OT';
    case '7':
      return 'Final';
    default:
      return '';
  }
};

export default null;
