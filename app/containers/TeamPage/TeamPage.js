import React from 'react';
import { Helmet } from 'react-helmet';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import './style.scss';
import TeamImg from '../../images/teams/canadiens.png';

export default class TeamPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="team-page">
        <Helmet>
          <title>Montreal Canadiens</title>
          <meta
            name="description"
            content="Montreal Canadiens"
          />
        </Helmet>
        <div className="team-header">
          <div className="team-header-title">
            <div className="team-img">
              <img src={TeamImg} className="team-img-logo" />
            </div>
            <div>
              <h2>Montreal Canadiens</h2>
              <p>8th Eastern Conference, 4th Atlantic</p>
            </div>
          </div>
          <div className="team-info">
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="light small-text">GP</div>
                <div className="bold">33</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">W</div>
                <div className="bold">15</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">L</div>
                <div className="bold">41</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">OTL</div>
                <div className="bold">2</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">Pts</div>
                <div className="bold">18</div>
              </div>
            </div>
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="light small-text">Goals</div>
                <div className="bold">33</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">GA</div>
                <div className="bold">15</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">PP%</div>
                <div className="bold">41</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">PK%</div>
                <div className="bold">2</div>
              </div>
            </div>
          </div>
        </div>
        <h3>Forwards</h3>
        <h3>Defensemen</h3>
        <h3>Goalies</h3>
      </div>
    );
  }
}
