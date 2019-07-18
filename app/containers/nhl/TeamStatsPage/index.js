import React from 'react';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { getTeamsQuery } from './query.js';
import TeamsTable from '../../../components/Table/TeamsTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import './style.scss';

class TeamStatsPage extends React.Component {
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
          <Query query={getTeamsQuery}>
            {({ loading, error, data }) => {
              if (loading) return (<LoadingIndicator />);
              if (error) return (<EmptyState isError />);

              const teams = data.teams;

              return (
                <TeamsTable teams={teams} />
              );
            }}

          </Query>

        </div>
      </div>
    );
  }
}

export default TeamStatsPage;
