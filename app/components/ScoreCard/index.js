import React from 'react';
import { pathOr } from 'ramda';
import { isScheduled, getStatusText, getFinalPeriod } from '../../utils/game';
import { smallLogoForTeamName, calculatePoints } from '../../utils/team';
import VideoPlayer from '../VideoPlayer';
import PlayIcon from '../../images/play-button.svg';
import './styles.scss';

const ScoreCard = ({ game }) => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">

        { game.status.detailedState === 'In Progress' | game.status.detailedState === 'Scheduled' | game.status.detailedState === 'In Progress - Critical' ? null : (<span>{game.status.detailedState}</span>) }
        {' '}
        <span>
          {getStatusText(game)}
          {getFinalPeriod(game)}
        </span>
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
      {
        game.status.detailedState === 'Scheduled' ? null : (
          <div className="game-card-footer">
            <a href={`/game?id=${game.id}`}>
                Summary
            </a>
            {
              pathOr(false, ['highlights', 'recap'], game)
                ? (
                  <span>
                    <VideoPlayer url={game.highlights.recap} callToAction="Game Recap" />
                  </span>
                )
                : null
            }
          </div>
        )
      }
    </div>
  </div>
);

export default ScoreCard;
