import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  filter, map, isEmpty, pipe, reject,
} from 'ramda';
import './style.scss';
import {
  isScratched,
  isGoalie,
  isScratchedOrGoalie,
} from '../../utils/player';
import { logoForTeamName } from '../../utils/team';
import { gameStatusLabels } from '../../utils/game';
import BoxTable from '../../components/Table/BoxTable';

const intoLink = player => (
  <a className="scratches-player" href={`/player?id=${player.person.id}`}>{player.person.fullName}</a>
);

class GamePage extends React.Component {
  componentDidMount() {
    const { fetchGameBoxscore, gameId, gameBoxscore } = this.props;
    if (gameId && isEmpty(gameBoxscore)) {
      fetchGameBoxscore(gameId);
    }
    this.liveFeedInterval = setInterval(() => fetchGameBoxscore(gameId), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.liveFeedInterval);
  }

  render() {
    const { gameBoxscore } = this.props;
    if (!gameBoxscore.away || !gameBoxscore.home) {
      return null;
    }
    const awayTeamImage = (
      <img
        src={logoForTeamName(gameBoxscore.away.team.teamName)}
        alt=""
      />
    );
    const homeTeamImage = (
      <img
        src={logoForTeamName(gameBoxscore.home.team.teamName)}
        alt=""
      />
    );
    return (
      <div>
        <Helmet>
          <title>Game Page</title>
          <meta name="description" content="Game Page" />
        </Helmet>
        <div className="summary">
          <div className="summary-header">
            <div className="summary-header-team">
              {awayTeamImage}
              <div className="summary-header-team-name">
                <div className="city">{gameBoxscore.away.team.location}</div>
                <div className="team">{gameBoxscore.away.team.teamName}</div>
                <div className="record">(20-16-8 48pts)</div>
              </div>
              <div className="summary-header-team-score">
                {gameBoxscore.away.teamStats.goals}
              </div>
            </div>
            <div className="summary-header-result">
              {gameStatusLabels[gameBoxscore.status.codedGameState]}
            </div>
            <div className="summary-header-team">
              <div className="summary-header-team-score">
                {gameBoxscore.home.teamStats.goals}
              </div>
              <div className="summary-header-team-name">
                <div className="city">{gameBoxscore.home.team.location}</div>
                <div className="team">{gameBoxscore.home.team.teamName}</div>
                <div className="record">(28-13-4 60pts)</div>
              </div>
              {homeTeamImage}
            </div>
          </div>
          <div className="summary-period">
            <div className="summary-period-card-wrapper">
              <div className="summary-period-card">
                <table className="period-table">
                  <thead>
                    <th>Team</th>
                    <th>PIM</th>
                    <th>PP</th>
                    <th>Hits</th>
                    <th>Fo%</th>
                    <th>TK</th>
                    <th>GV</th>
                    <th>BK</th>
                    <th>Shots</th>
                    <th>Goals</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a href={`/team?id=${gameBoxscore.away.team.id}`}>
                          {awayTeamImage}
                          {gameBoxscore.away.team.name}
                        </a>
                      </td>
                      <td>{gameBoxscore.away.teamStats.pim}</td>
                      <td>{`${gameBoxscore.away.teamStats.powerPlayGoals}/${gameBoxscore.away.teamStats.powerPlayOpportunities}`}</td>
                      <td>{gameBoxscore.away.teamStats.hits}</td>
                      <td>{gameBoxscore.away.teamStats.faceOffWinPercentage.toFixed()}</td>
                      <td>{gameBoxscore.away.teamStats.takeaways}</td>
                      <td>{gameBoxscore.away.teamStats.giveaways}</td>
                      <td>{gameBoxscore.away.teamStats.blocked}</td>
                      <td>{gameBoxscore.away.teamStats.shots}</td>
                      <td>{gameBoxscore.away.teamStats.goals}</td>
                    </tr>
                    <tr>
                      <td>
                        <a href={`/team?id=${gameBoxscore.home.team.id}`}>
                          {homeTeamImage}
                          {gameBoxscore.home.team.name}
                        </a>
                      </td>
                      <td>{gameBoxscore.home.teamStats.pim}</td>
                      <td>{`${gameBoxscore.home.teamStats.powerPlayGoals}/${gameBoxscore.home.teamStats.powerPlayOpportunities}`}</td>
                      <td>{gameBoxscore.home.teamStats.hits}</td>
                      <td>{gameBoxscore.home.teamStats.faceOffWinPercentage.toFixed()}</td>
                      <td>{gameBoxscore.home.teamStats.takeaways}</td>
                      <td>{gameBoxscore.home.teamStats.giveaways}</td>
                      <td>{gameBoxscore.home.teamStats.blocked}</td>
                      <td>{gameBoxscore.home.teamStats.shots}</td>
                      <td>{gameBoxscore.home.teamStats.goals}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h3>{gameBoxscore.away.team.name}</h3>
          <BoxTable
            players={reject(isScratchedOrGoalie, gameBoxscore.away.players)}
            goalieMode={false}
          />
          <BoxTable
            players={filter(isGoalie, gameBoxscore.away.players)}
            goalieMode
          />
          <div className="scratches">
            <span>Scratches: </span>
            {pipe(
              filter(isScratched),
              map(intoLink),
            )(gameBoxscore.away.players)}
          </div>

          <h3>{gameBoxscore.home.team.name}</h3>
          <BoxTable
            players={reject(isScratchedOrGoalie, gameBoxscore.home.players)}
            goalieMode={false}
          />
          <BoxTable
            players={filter(isGoalie, gameBoxscore.home.players)}
            goalieMode
          />
          <div className="scratches">
            <span>Scratches: </span>
            {pipe(
              filter(isScratched),
              map(intoLink),
            )(gameBoxscore.home.players)}
          </div>
        </div>
      </div>
    );
  }
}

GamePage.propTypes = {
  fetchGameBoxscore: PropTypes.func.isRequired,
  gameBoxscore: PropTypes.shape({}).isRequired,
  gameId: PropTypes.string.isRequired,
};

export default GamePage;
