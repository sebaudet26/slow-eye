import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import TeamsTable from '../../components/Table/TeamsTable';
import './style.scss';

export default class TeamStatsPage extends React.Component {
  componentDidMount() {
    const { fetchAllTeams } = this.props;
    fetchAllTeams();
  }

  render() {
    const { teams } = this.props;
    return (
      <div>
        <Helmet>
          <title>Team Stats</title>
          <meta name="description" content="Seal Stats" />
        </Helmet>
        <div className="teamStats-page">
          <h2>Team Stats</h2>
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
