import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ScoreCard from '../../components/ScoreCard';
import './style.scss';

export default class ScorePage extends React.Component {
  componentDidMount() {
    const { fetchTodaysGames } = this.props;
    fetchTodaysGames();
  }

  render() {
    const { games } = this.props;
    console.log(games);
    return (
      <div className="score-page">
        <Helmet>
          <title>Scores</title>
          <meta
            name="description"
            content="Scores"
          />
        </Helmet>
        <h2>Scores</h2>
        <div className="scoreboard-selector">
          <a className="scoreboard-selector-item">
            Sun Jan 6
          </a>
          <a className="scoreboard-selector-item">
            Mon Jan 7
          </a>
          <a className="scoreboard-selector-item active">
            Today's Games
          </a>
          <a className="scoreboard-selector-item">
            Wed Jan 9
          </a>
          <a className="scoreboard-selector-item">
            Thu Jan 10
          </a>
        </div>
        <div className="scoreboard">
          {games.map(game => <ScoreCard game={game} />)}
        </div>
      </div>
    );
  }
}

ScorePage.propTypes = {
  fetchTodaysGames: PropTypes.func.isRequired,
};
