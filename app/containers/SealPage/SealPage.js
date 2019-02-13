import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SpotifyPlayer from 'react-spotify-player';
import './style.scss';

const size = {
  width: '100%',
  height: 150,
};
const view = 'list'; // or 'coverart'
const theme = 'white'; // or 'white'

class SealPage extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Seal</title>
          <meta
            name="description"
            content="Seal is the best singer of all time."
          />
        </Helmet>
        <div className="player-header">
          <div className="player-img">
            <img
              src="/images/seal.png"
              className="player-img-face"
            />
            <div className="icon-wrapper player-img-country">
              <img src="/images/country/GBR.svg" className="" />
            </div>
            <div className="icon-wrapper player-img-team">
              <img src="/images/teams/tune_squad.png" className="" />
            </div>
          </div>
          <div className="player-info">
            <h2>Henry "Seal" Samuel</h2>
            <p>
              <div>Space Jam, Singer, Shoots Left</div>
            </p>
            <div className="player-desc">
              <div>
                <p>
                  <span className="bold">Born</span>
                  {' February 19, 1963 (55 years ago)'}
                </p>
                <p>
                  <span className="bold"> Birthplace</span>
                  {' London, England'}
                </p>
                <p>
                  <span className="bold">Height</span>
                  {' 6\'3 ft. '}
                  <span className="bold">Weight</span>
                  {' 180 lbs. '}
                </p>
              </div>
              <div className="player-desc-right">
                <div>
                  <p>
                    <span className="bold">Drafted by</span>
                    {' Tune Squad, 1996'}
                  </p>
                </div>
              </div>
            </div>
            <div className="player-stats">
              <div className="player-stats-item">
                <div className="light small-text">Records Sold</div>
                <div className="bold">
                  20M
                </div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text">Grammy Awards</div>
                <div className="bold">
                  4
                </div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text"># Albums</div>
                <div className="bold">
                  10
                </div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text"># Top 100 Singles</div>
                <div className="bold">
                  8
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3>Career Hits</h3>
        <SpotifyPlayer
          uri="spotify:track:1EZTmETpKksbQrxqSTDUIS"
          size={size}
          view={view}
          theme={theme}
        />
        <SpotifyPlayer
          uri="spotify:track:3YKptz29AsOlm7WAVnztBh"
          size={size}
          view={view}
          theme={theme}
        />
      </div>
    );
  }
}

export default SealPage;
