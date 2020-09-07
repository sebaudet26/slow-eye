import React from 'react';
import { pathOr } from 'ramda';
import { smallLogoForTeamName } from '../../utils/team';
import VideoPlayer from '../VideoPlayer';
import PlayIcon from '../../public/images/play-button.svg';
import './styles.scss';

const ScoreCard = ({ game }) => (
  <div className="game-card-wrapper">
    <div className="game-card">
      <div className="game-card-header">
        {game.isScheduled ? game.statusText : [game.currentPeriodTime, game.currentPeriod].join(' ')}
        <span>
          {
            game.seriesSummary && (
              <span className="game-card-series-summary">{game.seriesSummary}</span>
            )
          }

        </span>
      </div>
      <div className="game-card-team">
        <svg key={Math.random()} className="game-card-team-img">
          <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${game.awayTeam.id}-20182019-light`} />
        </svg>
        <a className="game-card-team-name" href={`/team?id=${game.awayTeam.id}`}>
          {game.awayTeam.name}
        </a>
        <div className="game-card-team-score">
          {
            game.isScheduled ? (
              <span>
                {game.awayTeam.wins}
                {'-'}
                {game.awayTeam.losses}
                {'-'}
                {game.awayTeam.ot}
              </span>
            ) : (
              game.awayTeam.score
            )
          }
        </div>
      </div>
      <div className="game-card-team">
        <svg key={Math.random()} className="game-card-team-img">
          <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${game.homeTeam.id}-20182019-light`} />
        </svg>
        <a className="game-card-team-name" href={`/team?id=${game.homeTeam.id}`}>
          {game.homeTeam.name}
        </a>
        <div className="game-card-team-score">
          {
            game.isScheduled ? (
              <span>
                {game.homeTeam.wins}
                {'-'}
                {game.homeTeam.losses}
                {'-'}
                {game.homeTeam.ot}
              </span>
            ) : (
              game.homeTeam.score
            )
          }
        </div>
      </div>
      {
        !game.isScheduled && (
          <div className="game-card-footer">
            <a href={`/game?id=${game.id}`}>
                Summary
            </a>
            {
              pathOr(false, ['recap'], game) && (
                <span>
                  <VideoPlayer url={game.recap} callToAction="Game Recap" />
                </span>
              )
            }
          </div>
        )
      }
    </div>
  </div>
);

export default ScoreCard;
