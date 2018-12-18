import React from 'react';
import { Helmet } from 'react-helmet';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import './style.scss';
import PlayerImg from './images/6752.png';
import CountryImg from '../../images/country/FIN.svg';
import TeamImg from '../../images/teams/avalanche.png';
import RookieIcon from '../../images/pacifier2.svg';

export default class TeamPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Mikko Rantanen</title>
          <meta
            name="description"
            content="Mikko Rantanen"
          />
        </Helmet>
        <div className="player-header">
          <div className="player-info">
            <h2>Montreal Canadiens</h2>
            <p>4th Atlantic</p>
            <div className="player-stats">
              <div className="player-stats-item">
                <div className="light">GP</div>
                <div className="bold">33</div>
              </div>
              <div className="player-stats-item">
                <div className="light">W</div>
                <div className="bold">15</div>
              </div>
              <div className="player-stats-item">
                <div className="light">L</div>
                <div className="bold">41</div>
              </div>
              <div className="player-stats-item">
                <div className="light">OTL</div>
                <div className="bold">2</div>
              </div>
              <div className="player-stats-item">
                <div className="light">Pts</div>
                <div className="bold">18</div>
              </div>
            </div>
          </div>
        </div>
        <h2>Player Stats</h2>
      </div>
    );
  }
}
