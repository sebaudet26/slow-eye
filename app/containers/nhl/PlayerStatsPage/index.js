import React from 'react';
import { Query } from 'react-apollo';
import { getPlayersQuery } from './query.js';
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import PlayersTable from '../../../components/Table/PlayersTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import { dynamicSort } from '../../../utils/sort';
import './style.scss';

class PlayerStatsPage extends React.PureComponent {
  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <div className="playerStats-page">
          <Helmet titlePrefix="Player Stats" contentPrefix="View NHL Players Stats." />
          <Query query={getPlayersQuery}>
            {({ loading, error, data }) => {
              if (loading) return (<LoadingIndicator />);
              if (error) return (<EmptyState isError />);

              const players = data.playersReport;
              const teams = data.teams.sort(dynamicSort('name'));

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
