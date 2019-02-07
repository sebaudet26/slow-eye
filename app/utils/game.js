import { last } from 'ramda';
import moment from 'moment';
//
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
  if (lastEvent.period === 4) {
    return `Overtime ${lastEvent.periodTime}`;
  }
  return `Period ${lastEvent.period} ${lastEvent.periodTime}`;
};

export const getStatusText = (game) => {
  const statusCode = game.status
    ? game.status.codedGameState
    : game.liveFeed.status.codedGameState;

  switch (statusCode) {
    case '1':
      return `${moment(game.gameDate).format('h:mm')} PM`;
    case '3':
      return `${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    case '4':
      return `${calculateGameTime(last(game.liveFeed.lastTenPlays))}`;
    default:
      return '';
  }
};

export default null;
