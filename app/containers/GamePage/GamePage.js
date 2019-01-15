import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  equals, filter, isNil, join, map, or, pathOr, path, pipe, prop, reject,
} from 'ramda';
import './style.scss';
import BoxTable from '../../components/Table/BoxTable';

const urlParams = new URLSearchParams(window.location.search);
const isScratched = pipe(prop('boxscore'), isNil);
const isGoalie = pipe(path(['position', 'abbreviation']), equals('G'));
const isScratchedOrGoalie = p => or(isGoalie(p), isScratched(p));

const intoLink = player => (
  <a className="scratches-player" href={`/player?id=${player.person.id}`}>{player.person.fullName}</a>
);

class GamePage extends React.Component {
  componentDidMount() {
    const { fetchGameBoxscore } = this.props;
    fetchGameBoxscore(urlParams.get('id'));
  }

  render() {
    const { gameBoxscore } = this.props;
    console.log(gameBoxscore);
    if (!gameBoxscore.away || !gameBoxscore.home) {
      return null;
    }
    const awayTeamImage = (
      <img
        src={`../../images/teams/${gameBoxscore.away.team.teamName.replace(' ', '-').toLowerCase()}.png`}
        alt=""
      />
    );
    const homeTeamImage = (
      <img
        src={`../../images/teams/${gameBoxscore.home.team.teamName.replace(' ', '-').toLowerCase()}.png`}
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
              {'Final'}
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
                    <th />
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
};

export default GamePage;
