import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ReactPlayer from 'react-player';
import {
  filter, join, map, isEmpty, groupBy, mapObjIndexed, pick, pipe, prop, pathOr, propEq, reject, values,
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

const renderGoalInfo = onWatchVideo => goal => (
  <tr key={Math.random()}>
    <td>
      {goal.periodTime}
      <svg key={Math.random()}>
        <use xlinkHref={`/images/teams/season/20182019.svg#team-${goal.team.id}-20182019-light`} />
      </svg>
    </td>
    <td>
      <PlayerName
        withImage
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
        ))
      }
    </td>
    <td>{goal.strength}</td>
    <td onClick={() => onWatchVideo(goal.videoUrl)}>Watch</td>
  </tr>
);

const renderPenaltyInfo = penalty => (
  <tr key={Math.random()}>
    <td>
      {penalty.periodTime}
      <svg key={Math.random()}>
        <use xlinkHref={`/images/teams/season/20182019.svg#team-${penalty.team.id}-20182019-light`} />
      </svg>
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

const renderGoalEvents = (events = [], videos = [], period, onWatchVideo) => (
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
        <th>Goal Strength</th>
        <th>Video</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {
        map(
          renderGoalInfo(onWatchVideo),
          pipe(
            filter(propEq('period', period)),
            mapObjIndexed((o, k) => ({
              ...o,
              videoUrl: pathOr('', [k, 'url'], videos),
            })),
            values,
          )(events),
        )
      }
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
  constructor() {
    super();
    this.state = {
      watchVideoUrl: false,
    };
  }

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
    const { watchVideoUrl } = this.state;
    if (!game || !game.boxscore || !game.liveFeed) {
      return null;
    }

    const { boxscore, liveFeed, highlights } = game;
    const groupedHighlights = groupBy(prop('period'), highlights.goals || []);
    const { goalSummary = [], penaltySummary = [], lastTenPlays = [] } = liveFeed;

    const watchVideo = videoUrl => this.setState({ watchVideoUrl: videoUrl });

    const awayTeamImage = (
      <svg key={Math.random()} className="game-card-team-img">
        <use xlinkHref={`/images/teams/season/20182019.svg#team-${boxscore.away.team.id}-20182019-light`} />
      </svg>
    );

    const homeTeamImage = (
      <svg key={Math.random()} className="game-card-team-img">
        <use xlinkHref={`/images/teams/season/20182019.svg#team-${boxscore.home.team.id}-20182019-light`} />
      </svg>
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
              {`${liveFeed.status.detailedState}${getStatusText(game)}`}
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
          {
            highlights && highlights.recap ? (
              <div
                className="recap-link"
                style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}
                onClick={() => watchVideo(highlights.recap)}
              >
                  Watch Game Recap Video
              </div>
            ) : null
          }
          {
            watchVideoUrl ? (
              <div>
                <div
                  className="video-close"
                  onClick={() => this.setState({ watchVideoUrl: null })}
                >
                  CLOSE VIDEO
                </div>
                <ReactPlayer
                  url={this.state.watchVideoUrl}
                  playing
                  controls
                  muted
                  playsinline
                  width={window.outerWidth}
                  height={window.outerHeight - 70}
                  loop={false}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: '5',
                    background: 'lightgrey',
                  }}
                />
              </div>
            ) : null
          }
          <Tabs
            defaultIndex={Number(getFromLS('gameTabIndex')) || 1}
            onSelect={i => saveToLS('gameTabIndex', i)}
          >
            <TabList>
              <Tab>{boxscore.away.team.teamName}</Tab>
              <Tab>Summary</Tab>
              <Tab>{boxscore.home.team.teamName}</Tab>
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
                          <th>Shots</th>
                          <th>PIM</th>
                          <th>PP</th>
                          <th>Hits</th>
                          <th>Fo%</th>
                          <th>TK</th>
                          <th>GV</th>
                          <th>Bks</th>
                          <th>Goals</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <a href={`/team?id=${boxscore.away.team.id}`}>
                              {awayTeamImage}
                            </a>
                          </td>
                          <td>{boxscore.away.teamStats.shots}</td>
                          <td>{boxscore.away.teamStats.pim}</td>
                          <td>{`${boxscore.away.teamStats.powerPlayGoals}/${boxscore.away.teamStats.powerPlayOpportunities}`}</td>
                          <td>{boxscore.away.teamStats.hits}</td>
                          <td>{boxscore.away.teamStats.faceOffWinPercentage.toFixed()}</td>
                          <td>{boxscore.away.teamStats.takeaways}</td>
                          <td>{boxscore.away.teamStats.giveaways}</td>
                          <td>{boxscore.away.teamStats.blocked}</td>
                          <td>{boxscore.away.teamStats.goals}</td>
                        </tr>
                        <tr>
                          <td>
                            <a href={`/team?id=${boxscore.home.team.id}`}>
                              {homeTeamImage}
                            </a>
                          </td>
                          <td>{boxscore.home.teamStats.shots}</td>
                          <td>{boxscore.home.teamStats.pim}</td>
                          <td>{`${boxscore.home.teamStats.powerPlayGoals}/${boxscore.home.teamStats.powerPlayOpportunities}`}</td>
                          <td>{boxscore.home.teamStats.hits}</td>
                          <td>{boxscore.home.teamStats.faceOffWinPercentage.toFixed()}</td>
                          <td>{boxscore.home.teamStats.takeaways}</td>
                          <td>{boxscore.home.teamStats.giveaways}</td>
                          <td>{boxscore.home.teamStats.blocked}</td>
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
                    {renderGoalEvents(goalSummary, groupedHighlights['1'], 1, watchVideo)}
                    {renderGoalEvents(goalSummary, groupedHighlights['2'], 2, watchVideo)}
                    {renderGoalEvents(goalSummary, groupedHighlights['3'], 3, watchVideo)}
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
