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
          {
            game.seriesSummary ? (
              <span className="game-card-series-summary">{game.seriesSummary.seriesStatusShort || ''}</span>
            ) : null
          }

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
            game.status.detailedState === 'Scheduled' ? (
              <span>
                {game.teams.away.leagueRecord.wins}
                {'W - '}
                {game.teams.away.leagueRecord.losses}
                {'L'}
                { game.seriesSummary ? null : ` - ${game.teams.away.leagueRecord.ot}OT`
                }
              </span>
            ) : (
              game.teams.away.score
            )
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
            game.status.detailedState === 'Scheduled' ? (
              <span>
                {game.teams.home.leagueRecord.wins}
                {'W - '}
                {game.teams.home.leagueRecord.losses}
                {'L'}
                { game.seriesSummary ? null : ` - ${game.teams.home.leagueRecord.ot}OT`
                }
              </span>
            ) : (
              game.teams.home.score
            )
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
