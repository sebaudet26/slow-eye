const moment = require('moment');
const logger = require('../util//logger');
const {
  calculateTeamsStreaks,
  calculatePlayerStreaks,
} = require('./nhlApi');

const getMsUntilFourAM = () => Math.round(
  moment()
    .endOf('day')
    .add(4, 'hours')
    .valueOf() - moment().valueOf(),
);

console.log(`Will re-calculate streaks in ${(getMsUntilFourAM() / 1000 / 60 / 60).toFixed(1)} hours`);
setTimeout(
  () => {
    logger.info('Calculating streaks');
    calculateTeamsStreaks();
    calculatePlayerStreaks();
  },
  getMsUntilFourAM(),
);
