import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import PlayersTable from '../../components/Table/PlayersTable';
import './style.scss';

class PlayerStatsPage extends React.PureComponent {
  componentDidMount() {
    const { fetchPlayers } = this.props;
    fetchPlayers('20172018');
  }

  render() {
    const { players } = this.props;
    return (
      <article>
        <Helmet>
          <title>Player Stats</title>
          <meta name="description" content="Quick Stats" />
        </Helmet>
        <div className="playerStats-page">
          <h2>Player Stats</h2>
        </div>
        <PlayersTable players={players} />
      </article>
    );
  }
}

PlayerStatsPage.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchPlayers: PropTypes.func.isRequired,
};

export default PlayerStatsPage;
