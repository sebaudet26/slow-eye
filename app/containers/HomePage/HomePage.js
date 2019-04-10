import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { take } from 'ramda';
import './style.scss';

const HOT_PLAYERS_LIMIT = 5;
const HOT_TEAMS_LIMIT = 10;

const renderPlayerCard = player => (
  <a href={`/player?id=${player.id}`} className="card card-player" style={{ backgroundImage: `url("https://nhl.bamcontent.com/images/actionshots/${player.id}_low_resolution.jpg")` }}>
    <div className="card-content">
      <div className="card-content-name">
        {player.name.split(' ')[0]}
        <span>{player.name.split(' ')[1]}</span>
      </div>
      <div className="card-content-result">
        <div className="card-content-result-item">
          <div>Last 5 games</div>
          <div>
            <span>
              {`${player.points} PTS `}
            </span>
            {`(${player.goals}G ${player.assists}A)`}
          </div>
        </div>
      </div>
    </div>
  </a>
);

const renderTeamCard = (team, k) => (
  <a href={`/team?id=${team.id}`} className="card card-team">
    <div className="card-content">
      <div className="card-content-rank">
        {k + 1}
      </div>
      <div className="card-content-team">
        <svg key={Math.random()}>
          <use xlinkHref={`/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
        </svg>
        <span>{team.teamName}</span>
      </div>
      <div className="card-content-result">
        <div className="card-content-result-item">
          <div>{`Last ${team.games} games`}</div>
          <div>
            <span>{`${team.points} PTS `}</span>
            {`(${team.wins}-${team.losses}-${team.ot})`}
          </div>
        </div>
      </div>
    </div>
  </a>
);

export default class HomePage extends React.Component {
  componentWillMount() {
    const { fetchPlayersStreaks, fetchTeamsStreaks } = this.props;
    fetchPlayersStreaks();
    fetchTeamsStreaks();
  }

  render() {
    const { playersStreaks, teamsStreaks } = this.props;

    return (
      <div className="home-page container">
        <Helmet>
          <title>Home - SealStats.com</title>
          <meta
            name="description"
            content="Seal Stats is the best place to view NHL stats. User-friendly and fast."
          />
        </Helmet>
        <div className="home-page-wrapper">
          <div className="home-page-col">
            <h3>
              {' Who\'s hot?'}
              <a href="/hotplayers">View Full List</a>
            </h3>
            {playersStreaks && take(HOT_PLAYERS_LIMIT, playersStreaks).map(renderPlayerCard)}

          </div>
          <div className="home-page-col">
            <h3>
              {' Hot Teams'}
              <a href="/powerrankings">View Full List</a>
            </h3>
            <div className="power-container">
              {renderTeamCard && take(HOT_TEAMS_LIMIT, teamsStreaks).map(renderTeamCard)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
