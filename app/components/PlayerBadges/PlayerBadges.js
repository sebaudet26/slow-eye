import React from 'react';
import ReactTooltip from 'react-tooltip';

// Images
import RookieIcon from '../../public/images/pacifier.svg';
import VeteranIcon from '../../public/images/veteran.svg';
import InjuryIcon from '../../public/images/bandage.svg';
import HotIcon from '../../public/images/fire.svg';
import ColdIcon from '../../public/images/snowflake.svg';
import './style.scss';

const getPlusMinusText = ({ hotColdPlusMinus, position }) => (position === 'D' ? ` and ${hotColdPlusMinus} ` : '');
const getIsHotText = ({ hotColdPoints, hotColdGames }) => (
  `Hot Streak - ${hotColdPoints} pts in last ${hotColdGames} games`
);
const getIsColdText = ({ hotColdPoints, hotColdGames, hotColdPlusMinus, position }) => (
  `Cold Streak - ${hotColdPoints} pts${getPlusMinusText(hotColdPlusMinus, position)} in last ${hotColdGames} games`
);

const InjuredBadge = (
  <div className="icon-wrapper" data-tip="Injured">
    <img src={InjuryIcon} />
    <ReactTooltip />
  </div>
);

const RookieBadge = (
  <div className="icon-wrapper" data-tip="Rookie">
    <img src={RookieIcon} />
    <ReactTooltip />
  </div>
);

const VeteranBadge = (
  <div className="icon-wrapper" data-tip="Veteran">
    <img src={VeteranIcon} />
    <ReactTooltip />
  </div>
);

const PlayerBadges = ({ player }) => {
  const {
    status,
    streak,
    position,
  } = player

  const {
    isVeteran,
    isRookie,
    isInjured,
    isCaptain,
    isAlternate,
  } = status

  const {
    isHot,
    isCold,
    hotColdGames,
    hotColdPoints,
    hotColdPlusMinus,
  } = streak

  return (
    <div className="player-badges">
      { isInjured && InjuredBadge }
      { isRookie && RookieBadge }
      { isVeteran && VeteranBadge }
      { isHot && (
        <div
          className="icon-wrapper"
          data-tip={getIsHotText({ 
            hotColdPoints, 
            hotColdGames 
          })}
        >
          <img src={HotIcon} />
          <ReactTooltip />
        </div>
      )}
      { isCold && (
        <div
          className="icon-wrapper"
          data-tip={getIsColdText({ 
            hotColdPoints, 
            hotColdGames, 
            hotColdPlusMinus, 
            position: position.code 
          })}
        >
          <img src={ColdIcon} />
          <ReactTooltip />
        </div>
      )}
    </div>
  );
};

export default PlayerBadges;
