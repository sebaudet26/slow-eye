import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  filter, join, map, isEmpty, pick, pipe, reject, values,
} from 'ramda';
import './style.scss';
import {
  isScratched,
  isGoalie,
  isScratchedOrGoalie,
} from '../../utils/player';
import { logoForTeamName } from '../../utils/team';
import { getStatusText } from '../../utils/game';
import BoxTable from '../../components/Table/BoxTable';

const intoLink = player => (
  <a className="scratches-player" href={`/player?id=${player.person.id}`}>{player.person.fullName}</a>
);

class GamePage extends React.Component {
  componentDidMount() {
    const { fetchGameBoxscore, gameId, game } = this.props;
    if (gameId && isEmpty(game)) {
      fetchGameBoxscore(gameId);
    }
    this.liveFeedInterval = setInterval(() => fetchGameBoxscore(gameId), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.liveFeedInterval);
  }

  render() {
    const { game } = this.props;
    if (!game || !game.boxscore || !game.liveFeed) {
      return null;
    }

    const { boxscore } = game;

    const awayTeamImage = (
      <img
        src={logoForTeamName(boxscore.away.team.teamName)}
        alt=""
      />
    );

    const homeTeamImage = (
      <img
        src={logoForTeamName(boxscore.home.team.teamName)}
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
                <div className="city">{boxscore.away.team.location}</div>
                <div className="team">{boxscore.away.team.teamName}</div>
                <div className="record">
                  {join('-', values(pick(['wins', 'losses', 'ot'], boxscore.away.seasonTeamStats.splits[0])))}
                  {` ${boxscore.away.seasonTeamStats.splits[0].pts}pts`}
                </div>
              </div>
              <div className="summary-header-team-score">
                {boxscore.away.teamStats.goals}
              </div>
            </div>
            <div className="summary-header-result">
              {`${game.liveFeed.status.detailedState}${getStatusText(game)}`}
            </div>
            <div className="summary-header-team">
              <div className="summary-header-team-score">
                {boxscore.home.teamStats.goals}
              </div>
              <div className="summary-header-team-name">
                <div className="city">{boxscore.home.team.location}</div>
                <div className="team">{boxscore.home.team.teamName}</div>
                <div className="record">
                  {join('-', values(pick(['wins', 'losses', 'ot'], boxscore.home.seasonTeamStats.splits[0])))}
                  {` ${boxscore.home.seasonTeamStats.splits[0].pts}pts`}
                </div>
              </div>
              {homeTeamImage}
            </div>
          </div>
          <div className="summary-period">
            <div className="summary-period-card-wrapper">
              <div className="summary-period-card">
                <table className="period-table">
                  <thead>
                    <tr>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a href={`/team?id=${boxscore.away.team.id}`}>
                          {awayTeamImage}
                          {boxscore.away.team.name}
                        </a>
                      </td>
                      <td>{boxscore.away.teamStats.pim}</td>
                      <td>{`${boxscore.away.teamStats.powerPlayGoals}/${boxscore.away.teamStats.powerPlayOpportunities}`}</td>
                      <td>{boxscore.away.teamStats.hits}</td>
                      <td>{boxscore.away.teamStats.faceOffWinPercentage.toFixed()}</td>
                      <td>{boxscore.away.teamStats.takeaways}</td>
                      <td>{boxscore.away.teamStats.giveaways}</td>
                      <td>{boxscore.away.teamStats.blocked}</td>
                      <td>{boxscore.away.teamStats.shots}</td>
                      <td>{boxscore.away.teamStats.goals}</td>
                    </tr>
                    <tr>
                      <td>
                        <a href={`/team?id=${boxscore.home.team.id}`}>
                          {homeTeamImage}
                          {boxscore.home.team.name}
                        </a>
                      </td>
                      <td>{boxscore.home.teamStats.pim}</td>
                      <td>{`${boxscore.home.teamStats.powerPlayGoals}/${boxscore.home.teamStats.powerPlayOpportunities}`}</td>
                      <td>{boxscore.home.teamStats.hits}</td>
                      <td>{boxscore.home.teamStats.faceOffWinPercentage.toFixed()}</td>
                      <td>{boxscore.home.teamStats.takeaways}</td>
                      <td>{boxscore.home.teamStats.giveaways}</td>
                      <td>{boxscore.home.teamStats.blocked}</td>
                      <td>{boxscore.home.teamStats.shots}</td>
                      <td>{boxscore.home.teamStats.goals}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h3>{boxscore.away.team.name}</h3>
          <BoxTable
            players={reject(isScratchedOrGoalie, boxscore.away.players)}
            goalieMode={false}
          />
          <BoxTable
            players={filter(isGoalie, boxscore.away.players)}
            goalieMode
          />
          <div className="scratches">
            <span>Scratches: </span>
            {pipe(
              filter(isScratched),
              map(intoLink),
            )(boxscore.away.players)}
          </div>

          <h3>{boxscore.home.team.name}</h3>
          <BoxTable
            players={reject(isScratchedOrGoalie, boxscore.home.players)}
            goalieMode={false}
          />
          <BoxTable
            players={filter(isGoalie, boxscore.home.players)}
            goalieMode
          />
          <div className="scratches">
            <span>Scratches: </span>
            {pipe(
              filter(isScratched),
              map(intoLink),
            )(boxscore.home.players)}
          </div>
        </div>
      </div>
    );
  }
}

GamePage.propTypes = {
  fetchGameBoxscore: PropTypes.func.isRequired,
  game: PropTypes.shape({}).isRequired,
  gameId: PropTypes.string.isRequired,
};

export default GamePage;
