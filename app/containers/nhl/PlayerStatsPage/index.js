import React from 'react';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { getPlayersQuery } from './query.js';
import PlayersTable from '../../../components/Table/PlayersTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import './style.scss';

class PlayerStatsPage extends React.PureComponent {
  render() {
    return (
      <div className="playerStats-page">
        <Helmet>
          <title>Player Stats - SealStats.com</title>
          <meta name="description" content="View NHL Players Stats. Leaderboards. It's all here. Seal Stats is the best place to view NHL stats. User-friendly and fast." />
        </Helmet>
        <div className="page-header wFilters">
          <div className="container">
            <h2>Player Stats</h2>
          </div>
        </div>
        <Query query={getPlayersQuery}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />);
            if (error) return (<EmptyState isError />);


            const players = data.playersReport;
            const teams = data.teams;

            return (
              <PlayersTable
                players={players}
                teams={teams}
              />
            );
          }}

        </Query>
      </div>
    );
  }
}

export default PlayerStatsPage;
