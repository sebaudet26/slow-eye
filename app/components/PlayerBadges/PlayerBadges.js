import React from 'react';
import ReactTooltip from 'react-tooltip';

import {
  isHot,
  isCold,
  isInjured,
  isVeteran,
  pointsInLastGames,
  cumulativePlusMinusInLastGames,
  hotColdGames,
} from '../../utils/calculations';

// Images
import RookieIcon from '../../images/pacifier.svg';
import VeteranIcon from '../../images/veteran.svg';
import InjuryIcon from '../../images/bandage.svg';
import HotIcon from '../../images/fire.svg';
import ColdIcon from '../../images/snowflake.svg';
import './style.scss';

const getIsHotText = logs => (`Hot Streak - ${pointsInLastGames(logs)} pts in last ${hotColdGames} games`);
const getPlusMinusText = (logs, pos) => (pos === 'D' ? ` and ${cumulativePlusMinusInLastGames(logs)} ` : '');
const getIsColdText = (logs, pos) => (`Cold Streak - ${pointsInLastGames(logs)} pts${getPlusMinusText(logs, pos)} in last ${hotColdGames} games`);
const isActiveThisYear = latestSeason => latestSeason.season === '20182019';

const PlayerBadges = ({ info, stats, logs }) => (
  <div className="player-badges">
    { isInjured(info) ? (
      <div className="icon-wrapper" data-tip="Injured">
        <img src={InjuryIcon} />
        <ReactTooltip />
      </div>
    ) : null }
    { info.rookie ? (
      <div className="icon-wrapper" data-tip="Rookie">
        <img src={RookieIcon} />
        <ReactTooltip />
      </div>
    ) : null }
    { isVeteran(stats) ? (
      <div className="icon-wrapper" data-tip="Veteran">
        <img src={VeteranIcon} />
        <ReactTooltip />
      </div>
    ) : null }
    { isActiveThisYear(stats[stats.length - 1])
      && isHot(logs, info.primaryPosition.abbreviation)
      ? (
        <div className="icon-wrapper" data-tip={getIsHotText(logs)}>
          <img src={HotIcon} />
          <ReactTooltip />
        </div>
      ) : null
    }
    { isActiveThisYear(stats[stats.length - 1])
      && isCold(logs, info.primaryPosition.abbreviation)
      ? (
        <div className="icon-wrapper" data-tip={getIsColdText(logs, info.primaryPosition.abbreviation)}>
          <img src={ColdIcon} />
          <ReactTooltip />
        </div>
      )
      : null
    }
  </div>
);

export default PlayerBadges;
