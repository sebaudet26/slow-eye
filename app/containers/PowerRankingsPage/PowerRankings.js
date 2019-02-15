import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PowerRankingsTable from '../../components/Table/PowerRankingsTable';
import './style.scss';

class PowerRankingsPage extends Component {
  render() {
    return (
      <div className="powerRankings-page">
        <Helmet>
          <title>Power Rankings - SealStats.com</title>
          <meta
            name="description"
            content="Power Rankings"
          />
        </Helmet>
        <h2>
            Power Rankings
        </h2>
        <PowerRankingsTable />
      </div>
    );
  }
}

export default PowerRankingsPage;
