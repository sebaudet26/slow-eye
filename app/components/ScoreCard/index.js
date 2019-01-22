import React from 'react';
import { isScheduled, getStatusText } from '../../utils/game';
import { smallLogoForTeamName, calculatePoints } from '../../utils/team';
import './styles.scss';

const ScoreCard = args => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">
        {getStatusText(args.game)}
      </div>
      <div className="game-card-team">
        <img src={smallLogoForTeamName(args.game.teams.away.team.abbreviation)} alt="" />
        <a className="game-card-team-name" href={`/team?id=${args.game.teams.away.team.id}`}>
          {args.game.teams.away.team.name}
        </a>
        <div className="game-card-team-score">
          {
            isScheduled(args.game)
              ? calculatePoints(args.game.teams.away)
              : args.game.teams.away.score
          }
        </div>
      </div>
      <div className="game-card-team">
        <img src={smallLogoForTeamName(args.game.teams.home.team.abbreviation)} alt="" />
        <a className="game-card-team-name" href={`/team?id=${args.game.teams.home.team.id}`}>
          {args.game.teams.home.team.name}
        </a>
        <div className="game-card-team-score">
          {
            isScheduled(args.game)
              ? calculatePoints(args.game.teams.home)
              : args.game.teams.home.score
          }
        </div>
      </div>
      {args.game.status.detailedState === 'Scheduled' ? null : <div className="game-card-footer"><a href={`/game?id=${args.game.id}`}>Game Summary</a></div>}
    </div>
  </div>
);

export default ScoreCard;
