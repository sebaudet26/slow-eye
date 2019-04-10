import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PowerRankingsTable from '../../components/Table/PowerRankingsTable';
import './style.scss';

class PowerRankingsPage extends Component {
  componentWillMount() {
    const { fetchTeamsStreaks } = this.props;
    fetchTeamsStreaks();
  }

  render() {
    const { teamsStreaks } = this.props;
    return (
      <div className="powerRankings-page container">
        <Helmet>
          <title>Power Rankings - SealStats.com</title>
          <meta
            name="description"
            content="Power Rankings"
          />
        </Helmet>
        <h2>
            Hot Teams
        </h2>
        <PowerRankingsTable teams={teamsStreaks} />
      </div>
    );
  }
}

export default PowerRankingsPage;
