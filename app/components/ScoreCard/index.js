import React from 'react';
import { isScheduled, getStatusText } from '../../utils/game';
import { smallLogoForTeamName, calculatePoints } from '../../utils/team';
import PlayIcon from '../../images/play-button.svg';
import './styles.scss';

const ScoreCard = ({ game }) => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">
        <span>{game.status.detailedState}</span>
        {' '}
        <span>{getStatusText(game)}</span>
      </div>
      <div className="game-card-team">
        <svg key={Math.random()} className="game-card-team-img">
          <use xlinkHref={`/images/teams/season/20182019.svg#team-${game.teams.away.team.id}-20182019-light`} />
        </svg>
        <a className="game-card-team-name" href={`/team?id=${game.teams.away.team.id}`}>
          {game.teams.away.team.name}
        </a>
        <div className="game-card-team-score">
          {
            isScheduled(game)
              ? calculatePoints(game.teams.away)
              : game.teams.away.score
          }
        </div>
      </div>
      <div className="game-card-team">
        <svg key={Math.random()} className="game-card-team-img">
          <use xlinkHref={`/images/teams/season/20182019.svg#team-${game.teams.home.team.id}-20182019-light`} />
        </svg>
        <a className="game-card-team-name" href={`/team?id=${game.teams.home.team.id}`}>
          {game.teams.home.team.name}
        </a>
        <div className="game-card-team-score">
          {
            isScheduled(game)
              ? calculatePoints(game.teams.home)
              : game.teams.home.score
          }
        </div>
      </div>
      {game.status.detailedState === 'Scheduled' ? null : (
        <div className="game-card-footer">
          <a href={`/game?id=${game.id}`}>
            Summary
          </a>
          <a href={`/game?id=${game.id}`}>
            <img src={PlayIcon} />
            Watch Recap
          </a>
        </div>
      )}
    </div>
  </div>
);

export default ScoreCard;
