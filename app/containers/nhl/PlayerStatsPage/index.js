import React from 'react';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { getPlayersQuery } from './query.js';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PlayersTable from '../../../components/Table/PlayersTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import './style.scss';

class PlayerStatsPage extends React.PureComponent {
  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <div className="playerStats-page">
          <Helmet>
            <title>Player Stats - SealStats.com</title>
            <meta name="description" content="View NHL Players Stats. Leaderboards. It's all here. Seal Stats is the best place to view NHL stats. User-friendly and fast." />
          </Helmet>

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
        <Footer />
      </div>
    );
  }
}

export default PlayerStatsPage;
