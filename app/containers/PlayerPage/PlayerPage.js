import React from 'react';
import { Helmet } from 'react-helmet';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import './style.scss';
import PlayerImg from './images/6752.png';
import CountryImg from './images/finland.png';
import TeamImg from './images/avs.png';

export default class PlayerPage extends React.Component {
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
          <div className="player-img">
            <img src={PlayerImg} className="player-img-face"/>
            <img src={CountryImg} className="player-img-country"/>
            <img src={TeamImg} className="player-img-team"/>
          </div>
          <div class="player-desc">
            <h2>Mikko Rantanen</h2>
            <p>#96, RW, Colorado Avalanche, Shoots L</p>
            <p>Finland, October 29, 1996 (23 years old)</p>
            <div className="player-stats">
              <div className="player-stats-item">
                <div className="light">GP</div>
                <div className="bold">33</div>
              </div>
              <div className="player-stats-item">
                <div className="light">G</div>
                <div className="bold">15</div>
              </div>
              <div className="player-stats-item">
                <div className="light">A</div>
                <div className="bold">41</div>
              </div>
              <div className="player-stats-item">
                <div className="light">Pts</div>
                <div className="bold">56</div>
              </div>
              <div className="player-stats-item">
                <div className="light">+/-</div>
                <div className="bold">18</div>
              </div>
            </div>
          </div>
        </div>
        <CareerStatsTable/>
      </div>
    );
  }
}
