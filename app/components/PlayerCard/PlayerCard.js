import React from 'react';
import './style.scss';

class PlayerCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="player-card">
        <div className="player-card-header">
          <div className="player-card-header-item">
            <img className="headshot" src="https://nhl.bamcontent.com/images/headshots/current/168x168/8477503@2x.png" />
          </div>
          <div className="player-card-header-item">
            <div className="semibold">Max Domi</div>
            <div className="country">
              <img src="/images/country/CAN.svg"/> Canada
            </div>
            <div>23 yrs.</div>
          </div>
          <div className="player-card-header-item status">
            <img src="/images/fire.svg"/>
            <img src="/images/pacifier.svg"/>
          </div>
        </div>
        <div className="player-card-stats">
          <div className="player-card-stats-item">
            <div className="light small-text">GP</div>
            <div className="bold">12</div>
          </div>
          <div className="player-card-stats-item">
            <div className="light small-text">G</div>
            <div className="bold">2</div>
          </div>
          <div className="player-card-stats-item">
            <div className="light small-text">A</div>
            <div className="bold">2</div>
          </div>
          <div className="player-card-stats-item">
            <div className="light small-text">Pts</div>
            <div className="bold">2</div>
          </div>
          <div className="player-card-stats-item">
            <div className="light small-text">+/-</div>
            <div className="bold">-4</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerCard;
