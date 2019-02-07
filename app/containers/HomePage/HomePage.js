import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import FireIcon from '../../images/Fire.svg';
import PowerIcon from '../../images/boxing.svg';
import './style.scss';

// const bg = require('https://nhl.bamcontent.com/images/actionshots/8478402.jpg');


export default class HomePage extends React.Component {
  render() {
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

            <a href="" className="card card-player" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478402_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                Connor
                  {' '}
                  <span>McDavid</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 7 games</div>
                    <div>
                      <span>27</span>
                      PTS
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href="" className="card card-player" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8474141_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Patrick
                  {' '}
                  <span>Kane</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 7 games</div>
                    <div>
                      <span>27</span>
                      PTS
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href="" className="card card-player" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478420_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Mikko
                  {' '}
                  <span>Rantanen</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 7 games</div>
                    <div>
                      <span>27</span>
                      PTS
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href="" className="card card-player" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8476346_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Johnny
                  {' '}
                  <span>Gaudreau</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 7 games</div>
                    <div>
                      <span>27</span>
                      PTS
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href="" className="card card-player" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8480829_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Jesperi
                  {' '}
                  <span>Kotkaniemi</span>
                </div>
                <div className="card-content-result">
                  <div className="card-content-result-item">
                    <div>Last 7 games</div>
                    <div>
                      <span>27</span>
                      PTS
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className="home-page-col">
            <h3>
              <div className="icon-wrapper">
                <img src={PowerIcon} />
              </div>
              {' '}
              Power Rankings
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
