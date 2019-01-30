import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import PlayersTable from '../../components/Table/PlayersTable';
import './style.scss';

class PlayerStatsPage extends React.PureComponent {
  render() {
    const {
      players, fetchPlayers, fetchTeams, teams,
    } = this.props;
    return (
      <article>
        <Helmet>
          <title>Player Stats</title>
          <meta name="description" content="View NHL Players Stats. Leaderboards. Historical Stats. It's all here. Seal Stats is the best place to view NHL stats. User-friendly and fast." />
        </Helmet>
        <div className="playerStats-page">
          <h2>Player Stats</h2>
        </div>
        <PlayersTable
          players={players}
          fetchPlayers={fetchPlayers}
          fetchTeams={fetchTeams}
          teams={teams}
        />
      </article>
    );
  }
}

PlayerStatsPage.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchPlayers: PropTypes.func.isRequired,
  fetchTeams: PropTypes.func.isRequired,
};

export default PlayerStatsPage;
