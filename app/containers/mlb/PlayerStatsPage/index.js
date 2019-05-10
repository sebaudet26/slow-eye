import React from 'react';
import './style.scss';
import {
  isEmpty,
} from 'ramda';
import { Helmet } from 'react-helmet';

export default class MLBPlayerStatsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
    };
  }

  render() {
    return (
      <div className="playerStats-page">
        <Helmet>
          <title>MLB Player Stats - Sealstats.com</title>
          <meta
            name="description"
            content="View"
          />
        </Helmet>
        <div className="page-header">
          <div className="container">
            <h2>Player Stats</h2>
          </div>
        </div>
        <div className="container">
          Test
        </div>
      </div>
    );
  }
}
