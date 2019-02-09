import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import FireIcon from '../../images/fire.svg';
import PowerIcon from '../../images/boxing.svg';
import './style.scss';

const renderPlayerCard = player => (
  <a href="" className="card card-player" style={{ backgroundImage: `url("https://nhl.bamcontent.com/images/actionshots/${player.id}_low_resolution.jpg")` }}>
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
              {`${player.points} PTS`}
              {' '}
            </span>
            {`(${player.goals}G ${player.assists}A)`}
          </div>
        </div>
      </div>
    </div>
  </a>
);

export default class HomePage extends React.Component {
  componentWillMount() {
    const { fetchPlayersStreaks } = this.props;
    console.log('hop');
    fetchPlayersStreaks();
  }

  render() {
    const { playersStreaks } = this.props;
    console.log(playersStreaks);
    if (!playersStreaks || !playersStreaks.length) {
      return <div />;
    }

    return (
      <div className="home-page">
        <Helmet>
          <title>Home</title>
          <meta
            name="description"
            content="Seal Stats is the best place to view NHL stats. User-friendly and fast."
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
            </h3>
            {playersStreaks.map(renderPlayerCard)}
          </div>
          <div className="home-page-col">
            <h3>
              <div className="icon-wrapper">
                <img src={PowerIcon} />
              </div>
              {' '}
              Power Rankings (Top 10)
            </h3>
            <a href="" className="card card-team">
              <div className="card-content">
                <div className="card-content-rank">
                  01
                </div>
                <div className="card-content-team">
                  <svg key={Math.random()}>
                    <use xlinkHref="/images/teams/season/20182019.svg#team-4-20182019-light" />
                  </svg>
                  Philadelphia
                  {' '}
                  <span>Flyers</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 15 games</div>
                    <div>
                      12-1-2
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href="" className="card card-team">
              <div className="card-content">
                <div className="card-content-rank">
                  02
                </div>
                <div className="card-content-team">
                  <svg key={Math.random()}>
                    <use xlinkHref="/images/teams/season/20182019.svg#team-7-20182019-light" />
                  </svg>
                  Buffalo
                  {' '}
                  <span>Sabres</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 15 games</div>
                    <div>
                      12-1-2
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
