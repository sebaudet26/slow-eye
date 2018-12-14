import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PlayersTable from '../../components/Table/PlayersTable';
import './style.scss';

class HomePage extends React.PureComponent {
  componentDidMount() {
    const { fetchPlayers } = this.props;
    fetchPlayers();
  }

  render() {
    const { players } = this.props;
    console.log(players);
    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="Slow Eye" />
        </Helmet>
        <div className="home-page">
          <h1>Player Stats</h1>
          <Link to="/player">Sample Player Page</Link>
        </div>
        <PlayersTable players={players} />
      </article>
    );
  }
}

HomePage.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchPlayers: PropTypes.func.isRequired,
};

export default HomePage;
