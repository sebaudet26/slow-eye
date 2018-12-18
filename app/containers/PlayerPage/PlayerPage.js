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
          <div class="player-info">
            <h2>Mikko Rantanen</h2>
            <p>Colorado Avalanche, RW, Shoots L</p>
            <div className="player-desc">
              <div>
                <p><span className="bold">Drafted by</span> Colorado Avalanche</p>
                <p>1st Round, #10 Overall, 2015 NHL Draft</p>
              </div>
              <div className="player-desc-right">
                <p><span className="bold">Born</span> October 29, 1996 (22 yrs.), <span className="bold">Birthplace</span> Nousiainen, Finland</p>
                <p><span className="bold">Height</span> 6'4' (193), <span className="bold">Weight</span> 215 (98)</p>
              </div>
            </div>
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
