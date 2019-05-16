import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { fetchDivisionStandings } from '../../../../server/libs/mlbApi.js';

export default class MLBPlayerPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="player-page">
        <Helmet>
          <title>Player Page - Sealstats.com</title>
          <meta
            name="description"
            content=""
          />
        </Helmet>
        <div className="page-header">
          test
        </div>
        <div className="container">
          test
        </div>
      </div>
    );
  }
}
