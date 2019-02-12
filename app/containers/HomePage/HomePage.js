import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import FireIcon from '../../images/fire.svg';
import PowerIcon from '../../images/boxing.svg';
import './style.scss';

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
            {`${team.points} PTS (${team.wins}-${team.losses}-${team.ot})`}
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
      <div className="home-page">
        <Helmet>
          <title>Home</title>
          <meta
            name="description"
            contentx="Seal Stats is the best place to view NHL stats. User-friendly and fast."
          />
        </Helmet>
        <div className="home-page-wrapper">
          <div className="home-page-col">
            <h3>
              <div className="icon-wrapper">
                <img src={FireIcon} />
              </div>
              {' '}
              Who's hot? (Top 5)
              <a href="">View Full List</a>
            </h3>
            {playersStreaks && playersStreaks.map(renderPlayerCard)}

          </div>
          <div className="home-page-col">
            <h3>
              <div className="icon-wrapper">
                <img src={PowerIcon} />
              </div>
              {' '}
              Power Rankings (Top 10)
              <a href="">View Full List</a>
            </h3>
            {renderTeamCard && teamsStreaks.map(renderTeamCard)}
          </div>
        </div>
      </div>
    );
  }
}
