import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import TeamsTable from '../../../components/Table/TeamsTable';
import './style.scss';

export default class TeamStatsPage extends React.Component {
  componentDidMount() {
    const { fetchAllTeams } = this.props;
    fetchAllTeams();
  }

  render() {
    const { teams } = this.props;
    return (
      <div className="teamStats-page">
        <Helmet>
          <title>Team Stats - SealStats.com</title>
          <meta name="description" content="View NHL Team Stats. Seal Stats is the best place to view NHL stats. User-friendly and fast." />
        </Helmet>
        <div className="page-header">
          <div className="container">
            <h2>Team Stats</h2>
          </div>
        </div>
        <div className="container">
          <TeamsTable teams={teams} />
        </div>
      </div>
    );
  }
}

TeamStatsPage.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchAllTeams: PropTypes.func.isRequired,
};
