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
                    <th><span className="small-uppercase">Goals Per Period</span></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>Total</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {awayTeamImage}
                        {gameBoxscore.away.team.name}
                      </td>
                      <td>2</td>
                      <td>0</td>
                      <td>1</td>
                      <td>{gameBoxscore.away.teamStats.goals}</td>
                    </tr>
                    <tr>
                      <td>
                        {homeTeamImage}
                        {gameBoxscore.home.team.name}
                      </td>
                      <td>2</td>
                      <td>1</td>
                      <td>2</td>
                      <td>{gameBoxscore.home.teamStats.goals}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="summary-period-card-wrapper">
              <div className="summary-period-card">
                <table className="period-table">
                  <thead>
                    <th><span className="small-uppercase">Shots Per Period</span></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>Total</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {awayTeamImage}
                        {gameBoxscore.away.team.name}
                      </td>
                      <td>11</td>
                      <td>10</td>
                      <td>14</td>
                      <td>{gameBoxscore.away.teamStats.shots}</td>
                    </tr>
                    <tr>
                      <td>
                        {homeTeamImage}
                        {gameBoxscore.home.team.name}
                      </td>
                      <td>5</td>
                      <td>6</td>
                      <td>5</td>
                      <td>{gameBoxscore.home.teamStats.shots}</td>
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
            {
              `Scratches: ${pipe(
                filter(isScratched),
                map(pathOr('blah', ['person', 'fullName'])),
                join(', '),
              )(gameBoxscore.away.players)}`
            }
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
            {
              `Scratches: ${pipe(
                filter(isScratched),
                map(pathOr('blah', ['person', 'fullName'])),
                join(', '),
              )(gameBoxscore.home.players)}`
            }
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
