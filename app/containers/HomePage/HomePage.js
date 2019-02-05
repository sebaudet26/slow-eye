import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
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
            <h3>3 Stars of the Week - February 4, 2019</h3>
            <div className="home-page-col-wrapper">
              <a href="" className="card-vertical no-bam" style={{ backgroundImage: 'url("http://images.performgroup.com/di/library/Sporting_News_CA_CMS_image_storage/2/4e/jack-roslovic-020219-getty-ftrjpeg_i1jlmevaplfp10nmkt9w80i7i.jpg?t=-1329409624")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                    1
                  </div>
                  <div className="card-content-name">
                    Jack
                    {' '}
                    <span>Roslovic</span>
                  </div>
                </div>
              </a>
              <a href="" className="card-vertical no-bam" style={{ backgroundImage: 'url("http://www.philly.com/resizer/ntEQTAYV3iCwKufF5etJHPNEL3I=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/ZMEGKKXHJ5D2NGS7RSZ6JE4SNA.jpg")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                      2
                  </div>
                  <div className="card-content-name">
                      Carter
                    {' '}
                    <span>Hart</span>
                  </div>
                </div>
              </a>
              <a href="" className="card-vertical" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8476459.jpg")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                      3
                  </div>
                  <div className="card-content-name">
                      Mika
                    {' '}
                    <span>Zibanejad</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="home-page-col">
            <h3>3 Stars of the Month - January</h3>
            <div className="home-page-col-wrapper">
              <a href="" className="card-vertical" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8476346.jpg")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                    1
                  </div>
                  <div className="card-content-name">
                    Johnny
                    {' '}
                    <span>Gaudreau</span>
                  </div>
                </div>
              </a>
              <a href="" className="card-vertical" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8475215.jpg")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                    2
                  </div>
                  <div className="card-content-name">
                    Robin
                    {' '}
                    <span>Lehner</span>
                  </div>
                </div>
              </a>
              <a href="" className="card-vertical" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8474141.jpg")' }}>
                <div className="card-content">
                  <div className="card-content-number">
                    3
                  </div>
                  <div className="card-content-name">
                    Patrick
                    {' '}
                    <span>Kane</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          {/*
          <div className="home-page-col">
            <h3>Who's hot?</h3>
            <div className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478402_low_resolution.jpg")' }}>
              <div className="card-content">
                Connor
                {' '}
                <span>McDavid</span>
              </div>
            </div>
            <div className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8474141_low_resolution.jpg")' }}>
              <div className="card-content">
              Patrick
                {' '}
                <span>Kane</span>
              </div>
            </div>
            <div className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8478420_low_resolution.jpg")' }}>
              <div className="card-content">
                Mikko
                {' '}
                <span>Rantanen</span>
              </div>
            </div>
            <div className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8476346_low_resolution.jpg")' }}>
              <div className="card-content">
                Johnny
                {' '}
                <span>Gaudreau</span>
              </div>
            </div>
            <div className="card" style={{ backgroundImage: 'url("https://nhl.bamcontent.com/images/actionshots/8480829_low_resolution.jpg")' }}>
              <div className="card-content">
                Jesperi
                {' '}
                <span>Kotkaniemi</span>
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    );
  }
}
