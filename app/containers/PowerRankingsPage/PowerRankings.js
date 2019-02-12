import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PowerIcon from '../../images/boxing.svg';
import PowerRankingsTable from '../../components/Table/PowerRankingsTable';
import './style.scss';

class PowerRankingsPage extends Component {
  render() {
    return (
      <div className="powerRankings-page">
        <Helmet>
          <title>Power Rankings</title>
          <meta
            name="description"
            content="Power Rankings"
          />
        </Helmet>
        <h2>
          <div className="icon-wrapper">
            <img src={PowerIcon} />
          </div>
            Power Rankings
        </h2>
        <PowerRankingsTable />
      </div>
    );
  }
}

export default PowerRankingsPage;
