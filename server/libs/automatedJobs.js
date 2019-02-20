const moment = require('moment-timezone');
const logger = require('../util//logger');
const {
  calculateTeamsStreaks,
  calculatePlayerStreaks,
} = require('./nhlApi');

const getMsUntilFourAM = () => Math.round(
  moment.tz('America/New_York')
    .endOf('day')
    .add(4, 'hours')
    .valueOf() - moment.tz('America/New_York').valueOf(),
);

console.log(`Will re-calculate streaks in ${(getMsUntilFourAM() / 1000 / 60 / 60).toFixed(1)} hours`);
setTimeout(
  () => {
    logger.info('Calculating streaks');
    calculateTeamsStreaks({ forced: true });
    calculatePlayerStreaks({ forced: true });
  },
  getMsUntilFourAM(),
);
