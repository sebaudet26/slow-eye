import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import FireIcon from '../../images/Fire.svg';
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
              Who's hot?
            </h3>

            <a href="" className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478402_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                Connor
                  {' '}
                  <span>McDavid</span>
                </div>
              </div>
            </a>
            <a href="" className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8474141_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Patrick
                  {' '}
                  <span>Kane</span>
                </div>
              </div>
            </a>
            <a href="" className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478420_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Mikko
                  {' '}
                  <span>Rantanen</span>
                </div>
              </div>
            </a>
            <a href="" className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8476346_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Johnny
                  {' '}
                  <span>Gaudreau</span>
                </div>
              </div>
            </a>
            <a href="" className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8480829_low_resolution.jpg")' }}>
              <div className="card-content">
                <div className="card-content-name">
                  Jesperi
                  {' '}
                  <span>Kotkaniemi</span>
                </div>
              </div>
            </a>
          </div>
          <div className="home-page-col">
            <h3>Power Rankings</h3>
          </div>
        </div>
      </div>
    );
  }
}
