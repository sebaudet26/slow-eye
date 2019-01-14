import React from 'react';
import moment from 'moment';
import './styles.scss';

const isScheduled = game => game.status.detailedState === 'Scheduled';
const points = team => `${team.leagueRecord.wins * 2 + team.leagueRecord.ot} pts`;

const ScoreCard = args => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">
        {isScheduled(args.game) ? `${moment(args.game.gameDate).format('LLL')}` : `${args.game.status.detailedState}`}
      </div>
      <div className="game-card-team">
        <img src={`../../images/teams/small/${args.game.teams.home.team.abbreviation}.png`} />
        <div className="game-card-team-name">
          {args.game.teams.home.team.name}
        </div>
        <div className="game-card-team-score">
          {isScheduled(args.game) ? points(args.game.teams.home) : args.game.teams.home.score}
        </div>
      </div>
      <div className="game-card-team">
        <img src={`../../images/teams/small/${args.game.teams.away.team.abbreviation}.png`} />
        <div className="game-card-team-name">
          {args.game.teams.away.team.name}
        </div>
        <div className="game-card-team-score">
          {isScheduled(args.game) ? points(args.game.teams.away) : args.game.teams.away.score}
        </div>
      </div>
      <div className="game-card-footer">
        {args.game.status.detailedState === 'Scheduled' ? 'Preview' : <a href="/game?id=123">Game Summary</a>}
      </div>
    </div>
  </div>
);

export default ScoreCard;
