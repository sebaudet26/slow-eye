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
        <div className="semibold">{player.info.fullName}</div>
        <div className="country">
          <img src={`/images/country/${player.info.nationality}.svg`} />
          {` ${player.info.birthCountry}`}
        </div>
        <div>{`${player.info.currentAge} y.o.`}</div>
      </div>
      <div className="player-card-header-item status">
        <PlayerBadges stats={player.stats} info={player.info} logs={player.logs} />
      </div>
    </div>
    <div className="player-card-stats">
      <div className="player-card-stats-item">
        <div className="light small-text">{isGoalie(player) ? 'GS' : 'GP'}</div>
        <div className="bold">
          {
            isGoalie(player)
              ? player.stats[player.stats.length - 1].stat.gamesStarted
              : player.stats[player.stats.length - 1].stat.games
          }
        </div>
      </div>
      <div className="player-card-stats-item">
        <div className="light small-text">{isGoalie(player) ? 'W' : 'G'}</div>
        <div className="bold">
          {
            isGoalie(player)
              ? player.stats[player.stats.length - 1].stat.wins
              : player.stats[player.stats.length - 1].stat.goals
          }
        </div>
      </div>
      <div className="player-card-stats-item">
        <div className="light small-text">{isGoalie(player) ? 'L' : 'A'}</div>
        <div className="bold">
          {
            isGoalie(player)
              ? Number(player.stats[player.stats.length - 1].stat.losses) + Number(player.stats[player.stats.length - 1].stat.ot)
              : player.stats[player.stats.length - 1].stat.assists
          }
        </div>
      </div>
      <div className="player-card-stats-item">
        <div className="light small-text">{isGoalie(player) ? 'Sv%' : 'Pts'}</div>
        <div className="bold">
          {
            isGoalie(player)
              ? player.stats[player.stats.length - 1].stat.savePercentage
              : player.stats[player.stats.length - 1].stat.points
          }
        </div>
      </div>
      <div className="player-card-stats-item">
        <div className="light small-text">{isGoalie(player) ? 'GAA' : '-/+'}</div>
        <div className="bold">
          {
            isGoalie(player)
              ? player.stats[player.stats.length - 1].stat.goalAgainstAverage
              : player.stats[player.stats.length - 1].stat.plusMinus
          }
        </div>
      </div>
    </div>
  </div>
);

export default PlayerCard;
