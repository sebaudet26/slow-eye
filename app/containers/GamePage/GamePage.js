import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  filter, join, map, isEmpty, pick, pipe, reject, values,
} from 'ramda';
import './style.scss';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import {
  isScratched,
  isGoalie,
  isScratchedOrGoalie,
} from '../../utils/player';
import { logoForTeamName } from '../../utils/team';
import { getStatusText } from '../../utils/game';
import { saveToLS, getFromLS } from '../../utils/localStorage';
import { getNumberWithOrdinal } from '../../utils/misc';
import BoxTable from '../../components/Table/BoxTable';
import PlayerName from '../../components/PlayerName';

const renderGoalInfo = goal => (
  <tr key={Math.random()}>
    <td>
      {goal.periodTime}
      {' '}
-
      {' '}
      {goal.team.triCode}
    </td>
    <td>
      <PlayerName
        key={goal.scorer.id}
        id={goal.scorer.id}
        name={`${goal.scorer.fullName} (${goal.scorer.seasonTotal})`}
      />
    </td>
    <td>
      {
        goal.assists.map(player => (
          <PlayerName
            key={Math.random()}
            id={player.id}
            name={`${player.fullName} (${player.seasonTotal})`}
          />
        ))}
    </td>
    <td>{goal.strength}</td>
  </tr>
);

const renderPenaltyInfo = penalty => (
  <tr key={Math.random()}>
    <td>
      {penalty.periodTime}
      {' '}
-
      {' '}
      {penalty.team.triCode}
    </td>
    <td>
      <PlayerName
        key={Math.random()}
        id={penalty.receiver.id}
        name={penalty.receiver.fullName}
      />
    </td>
    <td>{penalty.type}</td>
    <td>{`${penalty.minutes} mins`}</td>
  </tr>
);

const renderGoalEvents = (events, period) => (
  <table className="events-table">
    <thead>
      <tr>
        <th>
          {`${getNumberWithOrdinal(period)} Period`}
        </th>
      </tr>
      <tr>
        <th>Time</th>
        <th>Goal By</th>
        <th>Assist(s)</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {map(renderGoalInfo, filter(event => event.period === period, events))}
    </tbody>
  </table>
);

const renderPenaltyEvents = (events, period) => (
  <table className="events-table">
    <thead>
      <tr>
        <th>
          {`${getNumberWithOrdinal(period)} Period`}
        </th>
      </tr>
      <tr>
        <th>Time</th>
        <th>By</th>
        <th>Reason</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {map(renderPenaltyInfo, filter(event => event.period === period, events))}
    </tbody>
  </table>
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

    const { boxscore, liveFeed } = game;

    const { goalSummary = [], penaltySummary = [], lastTenPlays = [] } = liveFeed;

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
          <meta name="description" content={`${boxscore.away.team.teamName} vs. ${boxscore.home.team.teamName} game page. Seal Stats is the best place to view NHL stats. User-friendly and fast. `} />
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

          <Tabs
            defaultIndex={Number(getFromLS('gameTabIndex')) || 1}
            onSelect={i => saveToLS('gameTabIndex', i)}
          >
            <TabList>
              <Tab>{boxscore.away.team.name}</Tab>
              <Tab>Summary</Tab>
              <Tab>{boxscore.home.team.name}</Tab>
            </TabList>
            <TabPanel>
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
                  map(p => (
                    <PlayerName
                      id={p.person.id}
                      name={p.person.fullName}
                    />
                  )),
                )(boxscore.away.players)}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="summary-overall">
                <div className="summary-overall-wrapper">
                  <div className="summary-overall-card">
                    <table className="overall-table">
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
              <h3>Scoring Summary</h3>
              <div className="summary-events">
                <div className="summary-events-wrapper">
                  <div className="summary-events-card">
                    {renderGoalEvents(goalSummary, 1)}
                    {renderGoalEvents(goalSummary, 2)}
                    {renderGoalEvents(goalSummary, 3)}
                  </div>
                </div>
              </div>
              <h3>Penalties</h3>
              <div className="summary-events">
                <div className="summary-events-wrapper">
                  <div className="summary-events-card">
                    {renderPenaltyEvents(penaltySummary, 1)}
                    {renderPenaltyEvents(penaltySummary, 2)}
                    {renderPenaltyEvents(penaltySummary, 3)}
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
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
                {
                  pipe(
                    filter(isScratched),
                    map(p => (
                      <PlayerName
                        id={p.person.id}
                        name={p.person.fullName}
                      />
                    )),
                  )(boxscore.home.players)
                }
              </div>
            </TabPanel>
          </Tabs>
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
