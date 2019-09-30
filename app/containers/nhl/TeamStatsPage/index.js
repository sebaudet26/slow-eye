import React from 'react';
import { Query } from 'react-apollo';
import { getTeamsQuery } from './query.js';
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import TeamsTable from '../../../components/Table/TeamsTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import './style.scss';

class TeamStatsPage extends React.Component {
  render() {
    const { teams } = this.props;
    return (
      <div>
        <Header selectedLeague="NHL" />
        <div className="teamStats-page">
          <Helmet titlePrefix="Team Stats" contentPrefix="View NHL Team Stats." />
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

                return <TeamsTable teams={teams} />;
              }}
            </Query>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default TeamStatsPage;
