import { tail } from 'ramda';
import moment from 'moment';

export const gameStatusLabels = {
  1: 'Scheduled',
  3: 'Live',
  7: 'Final',
};

export const isScheduled = game => game.status.detailedState === 'Scheduled';

export const calculateGameTime = (lastEvent) => {
  if (!lastEvent) {
    return 'Starting Soon';
  }
  return `Period ${lastEvent.period} ${lastEvent.periodTime}`;
};

export const getStatusText = (game) => {
  const statusCode = game.status
    ? game.status.codedGameState
    : game.liveFeed.status.codedGameState;

  switch (statusCode) {
    case '1':
      return `Scheduled ${moment(game.gameDate).format('h:mm')} PM`;
    case '3':
      return `Live - ${calculateGameTime(tail(game.liveFeed.lastTenPlays))}`;
    case '7':
      return 'Final';
    default:
      return '';
  }
};

export default null;
