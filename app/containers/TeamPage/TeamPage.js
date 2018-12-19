import React from 'react';
import { Helmet } from 'react-helmet';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import './style.scss';
import PlayerImg from './images/6752.png';
<<<<<<< HEAD
=======
import CountryImg from '../../images/country/FIN.svg';
import TeamImg from '../../images/teams/avalanche.png';
import RookieIcon from '../../images/pacifier2.svg';
>>>>>>> f7fa081326b42ed2e377653607ba2ab5fcbc154e

export default class TeamPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="team-page">
        <Helmet>
          <title>Mikko Rantanen</title>
          <meta
            name="description"
            content="Mikko Rantanen"
          />
        </Helmet>
<<<<<<< HEAD
        <div className="team-header">
          <h2>Montreal Canadiens</h2>
          <p>4th Atlantic</p>
          <div className="team-info">
            <div className="team-stats">
              <div className="team-stats-item">
=======
        <div className="player-header">
          <div className="player-info">
            <h2>Montreal Canadiens</h2>
            <p>4th Atlantic</p>
            <div className="player-stats">
              <div className="player-stats-item">
>>>>>>> f7fa081326b42ed2e377653607ba2ab5fcbc154e
                <div className="light">GP</div>
                <div className="bold">33</div>
              </div>
              <div className="team-stats-item">
                <div className="light">W</div>
                <div className="bold">15</div>
              </div>
              <div className="team-stats-item">
                <div className="light">L</div>
                <div className="bold">41</div>
              </div>
              <div className="team-stats-item">
                <div className="light">OTL</div>
                <div className="bold">2</div>
              </div>
              <div className="team-stats-item">
                <div className="light">Pts</div>
                <div className="bold">18</div>
              </div>
            </div>
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="light">Goals</div>
                <div className="bold">33</div>
              </div>
              <div className="team-stats-item">
                <div className="light">GA</div>
                <div className="bold">15</div>
              </div>
              <div className="team-stats-item">
                <div className="light">PP%</div>
                <div className="bold">41</div>
              </div>
              <div className="team-stats-item">
                <div className="light">PK%</div>
                <div className="bold">2</div>
              </div>
              <div className="team-stats-item">
                <div className="light">PIM</div>
                <div className="bold">18</div>
              </div>
            </div>
          </div>
        </div>
        <h2>Forwards</h2>
        <h2>Defensemen</h2>
        <h2>Goalies</h2>
      </div>
    );
  }
}
