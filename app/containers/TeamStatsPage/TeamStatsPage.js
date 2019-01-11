import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import TeamsTable from '../../components/Table/TeamsTable';
import './style.scss';
console.log('hop')
export default class TeamStatsPage extends React.Component {
  componentDidMount() {
    console.log('mount')
    const { fetchAllTeams } = this.props;
    fetchAllTeams();
  }

  render() {
    console.log('adsf')
    const { teams } = this.props;

    return (
      <div>
        <Helmet>
          <title>Team Stats</title>
          <meta name="description" content="Quick Stats" />
        </Helmet>
        <div className="teamStats-page">
          <h2>Team Stats</h2>
          <TeamsTable teams={teams}/>
        </div>
      </div>
    );
  }
}
