import React from 'react';
import PlayerBadges from '../PlayerBadges/PlayerBadges';
import './style.scss';

const isGoalie = player => player.info.primaryPosition.abbreviation === 'G';

const PlayerCard = ({ player }) => (
  <div className="player-card">
    <div className="player-card-header">
      <div className="player-card-header-item">
        <img className="headshot" src={`https://nhl.bamcontent.com/images/headshots/current/60x60/${player.id}@2x.png`} />
      </div>
      <div className="player-card-header-item">
        <a href={`/player?id=${player.id}`}>
          {player.info.fullName}
        </a>
        <div className="country">
          <img src={`/public/images/country/${player.info.nationality}.svg`} />
          {` ${player.info.birthCountry}`}
        </div>
        <div>{`${player.info.currentAge} y.o.`}</div>
      </div>
      <div className="player-card-header-item status">
        <PlayerBadges player={player} />
      </div>
    </div>
  </div>
);

export default PlayerCard;
