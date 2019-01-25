import React from 'react';
import { isScheduled, getStatusText } from '../../utils/game';
import { smallLogoForTeamName, calculatePoints } from '../../utils/team';
import './styles.scss';

const ScoreCard = ({ game }) => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">
        {`${game.status.detailedState}${getStatusText(game)}`}
      </div>
      <div className="game-card-team">
        <img src={smallLogoForTeamName(game.teams.away.team.abbreviation)} alt="" />
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
        <img src={smallLogoForTeamName(game.teams.home.team.abbreviation)} alt="" />
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
            Game Summary
          </a>
        </div>
      )}
    </div>
  </div>
);

export default ScoreCard;
