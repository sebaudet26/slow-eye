import React from 'react';
import { Helmet } from 'react-helmet';
import {
  filter,
  groupBy,
  isEmpty,
  isNil,
  join,
  last,
  map,
  mapObjIndexed,
  pathOr,
  pick,
  pipe,
  prop,
  propEq,
  reject,
  values,
} from 'ramda';
import './style.scss';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Query } from 'react-apollo';
import {
  isScratched,
  isGoalie,
  isScratchedOrGoalie,
} from '../../../utils/player';
import { getGameQuery } from './query.js';
import { getStatusText } from '../../../utils/game';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import { saveToLS, getFromLS } from '../../../utils/localStorage';
import { toOrdinal } from '../../../utils/misc';
import BoxTable from '../../../components/Table/BoxTable';
import PlayerName from '../../../components/PlayerName';
import PlayerImage from '../../../components/PlayerImage';
import VideoPlayer from '../../../components/VideoPlayer';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const renderGoalInfo = isShootout => goal => (
  <div key={Math.random()} className="card-cell">
    <div className="goal-image card-cell-item">
      <PlayerImage
        id={goal.scorer.id}
        size="60x60"
      />
      <div className="icon-wrapper">
        <svg className="goal-image-team" key={Math.random()}>
          <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${goal.team.id}-20182019-light`} />
        </svg>
      </div>
    </div>
    <div className="goal-details card-cell-item">
      <div className="goal-details-scorer">
        <PlayerName
          key={goal.scorer.id}
          id={goal.scorer.id}
          name={[
            goal.scorer.fullName,
            isShootout ? '' : `(${goal.scorer.seasonTotal})`,
          ].join(' ')}
        />
      </div>
      <div className="goal-details-assist">
        {
        goal.assists.map(player => (
          <PlayerName
            key={player.id}
            id={player.id}
            name={`${player.fullName} (${player.seasonTotal})`}
          />
        ))
      }
      </div>
      {
        !isShootout
          ? (
            <div className="goal-details-time">
              {`${goal.periodTime} - ${goal.strength}`}
            </div>
          )
          : null
      }
    </div>
    <div className="goal-video card-cell-item">
      {goal.videoUrl ? <VideoPlayer url={goal.videoUrl} /> : (<div />)}
    </div>
  </div>
);

const renderPenaltyInfo = penalty => (
  <div key={Math.random()} className="card-cell penalty">
    <div className="card-cell-item penalty-team">
      <svg className="penalty-img" key={Math.random()}>
        <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${penalty.team.id}-20182019-light`} />
      </svg>
      {penalty.periodTime}
    </div>
    <div className="card-cell-item penalty-player">
      <PlayerName
        key={Math.random()}
        id={penalty.receiver.id}
        name={penalty.receiver.fullName}
      />
    </div>
    <div className="card-cell-item penalty-info">
      <span className="hidden-mobile">
        {`${penalty.type} - ${penalty.minutes} mins`}
      </span>
    </div>
  </div>
);

const renderGoalEvents = (events = [], videos = [], period) => (
  <div className="card">
    <div className="card-header">
      {
        period === 5 ? 'Shootout'
          : period === 4 ? 'Overtime'
            : `${toOrdinal(period)} Period`
      }
    </div>
    {
      filter(propEq('period', period), events).length
        ? map(
          renderGoalInfo(period === 5),
          pipe(
            filter(propEq('period', period)),
            mapObjIndexed((o, k) => ({
              ...o,
              videoUrl: pathOr('', [k, 'url'], videos),
            })),
            values,
          )(events),
        )
        : <div className="non-event">No Goals</div>
    }
  </div>
);

const renderPenaltyEvents = (events, period) => (
  <div className="card">
    <div className="card-header">
      {period === 4 ? 'Overtime' : `${toOrdinal(period)} Period`}
    </div>
    {
      filter(propEq('period', period), events).length
        ? map(renderPenaltyInfo, filter(event => event.period === period, events))
        : <div className="non-event">No Penalties</div>
    }
  </div>
);

class GamePage extends React.Component {
  render() {
    return (
      <Query query={getGameQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return (<LoadingIndicator />);
          if (error) return (<EmptyState isError />);

          const game = data.game;

          console.log(game);

          const { boxscore, liveFeed, highlights } = game;

          const groupedHighlights = groupBy(prop('period'), highlights.goals || []);
          const {
            goalSummary = [], penaltySummary = [], lastTenPlays = [], shootoutSummary,
          } = liveFeed;
          const awayTeamImage = (
            <svg key={Math.random()} className="game-card-team-img">
              <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${boxscore.away.team.id}-20182019-light`} />
            </svg>
          );

          const homeTeamImage = (
            <svg key={Math.random()} className="game-card-team-img">
              <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${boxscore.home.team.id}-20182019-light`} />
            </svg>
          );

          return (
            <div className="game-page">
              <Helmet>
                <title>
                  {`${boxscore.away.team.teamName} @ ${boxscore.home.team.teamName} - SealStats.com`}
                </title>
                <meta name="description" content={`${boxscore.away.team.teamName} vs. ${boxscore.home.team.teamName} game page. Seal Stats is the best place to view NHL stats. User-friendly and fast. `} />
              </Helmet>
              <div className="page-header wTabs">
                <div className="container">
                  <div className="game-mobile-details">{getStatusText(game)}</div>
                  <div className="game-header">
                    <div className="game-header-team">
                      {awayTeamImage}
                      <div className="game-header-team-name">
                        <div className="city">{boxscore.away.team.location}</div>
                        <div className="team">{boxscore.away.team.teamName}</div>
                        <div className="record">
                          {join('-', values(pick(['wins', 'losses', 'ot'], boxscore.away.seasonTeamStats.splits[0])))}
                          {` ${boxscore.away.seasonTeamStats.splits[0].pts}pts`}
                        </div>
                      </div>
                      <div className="game-header-team-score">
                        {boxscore.away.teamStats.goals + (shootoutSummary && shootoutSummary.away.scores > shootoutSummary.home.scores ? 1 : 0)}
                      </div>
                    </div>
                    <div className="game-header-result">
                      <div className="hidden-mobile">
                        <div>{ liveFeed.status.detailedState === 'In Progress' | liveFeed.status.detailedState === 'In Progress - Critical' ? null : liveFeed.status.detailedState}</div>
                        <div>
                          {getStatusText(game)}
                          {last(lastTenPlays) && last(lastTenPlays).period === 5 ? 'S/O' : null}
                        </div>
                      </div>
                      {
                highlights && highlights.recap ? (
                  <VideoPlayer
                    url={highlights.recap}
                    styles={{ textAlign: 'center', width: '100%', marginTop: '5px' }}
                  />
                ) : (
                  <div className="game-mobile-result">
                  :
                  </div>
                )
              }
                    </div>
                    <div className="game-header-team">
                      <div className="game-header-team-score">
                        {boxscore.home.teamStats.goals + (shootoutSummary && shootoutSummary.home.scores > shootoutSummary.away.scores ? 1 : 0)}
                      </div>
                      <div className="game-header-team-name">
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
                </div>
              </div>
              <Tabs
                defaultIndex={isNil(getFromLS(`gameTabIndex${id}`)) ? 1 : Number(getFromLS(`gameTabIndex${id}`))}
                onSelect={i => saveToLS(`gameTabIndex${id}`, i)}
              >
                <TabList>
                  <div className="container">
                    <div className="react-tabs-center">
                      <Tab>{boxscore.away.team.teamName}</Tab>
                      <Tab>Summary</Tab>
                      <Tab>{boxscore.home.team.teamName}</Tab>
                    </div>
                  </div>
                </TabList>
                <div className="container">
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
                            key={p.person.id}
                            id={p.person.id}
                            name={p.person.fullName}
                          />
                        )),
                      )(boxscore.away.players)}
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="summary">
                      <div className="summary-col">
                        <h3>Scoring</h3>
                        {renderGoalEvents(goalSummary, groupedHighlights['1'], 1)}
                        {renderGoalEvents(goalSummary, groupedHighlights['2'], 2)}
                        {renderGoalEvents(goalSummary, groupedHighlights['3'], 3)}
                        {
                    last(lastTenPlays)
                      && (last(lastTenPlays).period === 4 || last(lastTenPlays).period === 5)
                      ? renderGoalEvents(goalSummary, groupedHighlights['4'], 4)
                      : null
                  }
                        {
                    last(lastTenPlays) && last(lastTenPlays).period === 5
                      ? renderGoalEvents(goalSummary, groupedHighlights['5'], 5)
                      : null
                  }
                        <h3>Penalties</h3>
                        {renderPenaltyEvents(penaltySummary, 1)}
                        {renderPenaltyEvents(penaltySummary, 2)}
                        {renderPenaltyEvents(penaltySummary, 3)}
                        {
                    last(lastTenPlays) && (last(lastTenPlays).period === 4 || last(lastTenPlays).period === 5)
                      ? renderPenaltyEvents(penaltySummary, 4)
                      : null
                  }
                      </div>
                      <div className="summary-col">
                        <h3>Team Stats</h3>
                        <div className="overall-wrapper">
                          <table className="overall-table">
                            <thead>
                              <tr>
                                <th />
                                <th>{awayTeamImage}</th>
                                <th>{homeTeamImage}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                          Shots
                                </td>
                                <td>{boxscore.away.teamStats.shots}</td>
                                <td>{boxscore.home.teamStats.shots}</td>
                              </tr>
                              <tr>
                                <td>
                          PIM
                                </td>
                                <td>{boxscore.away.teamStats.pim}</td>
                                <td>{boxscore.home.teamStats.pim}</td>
                              </tr>
                              <tr>
                                <td>
                          PP
                                </td>
                                <td>{`${boxscore.away.teamStats.powerPlayGoals}/${boxscore.away.teamStats.powerPlayOpportunities}`}</td>
                                <td>{`${boxscore.home.teamStats.powerPlayGoals}/${boxscore.home.teamStats.powerPlayOpportunities}`}</td>
                              </tr>
                              <tr>
                                <td>
                          Hits
                                </td>
                                <td>{boxscore.away.teamStats.hits}</td>
                                <td>{boxscore.home.teamStats.hits}</td>
                              </tr>
                              <tr>
                                <td>
                          FO%
                                </td>
                                <td>{boxscore.away.teamStats.faceOffWinPercentage.toFixed()}</td>
                                <td>{boxscore.home.teamStats.faceOffWinPercentage.toFixed()}</td>
                              </tr>
                              <tr>
                                <td>
                          TK
                                </td>
                                <td>{boxscore.away.teamStats.takeaways}</td>
                                <td>{boxscore.home.teamStats.takeaways}</td>
                              </tr>
                              <tr>
                                <td>
                          GV
                                </td>
                                <td>{boxscore.away.teamStats.giveaways}</td>
                                <td>{boxscore.home.teamStats.giveaways}</td>
                              </tr>
                              <tr>
                                <td>
                          Bks
                                </td>
                                <td>{boxscore.away.teamStats.blocked}</td>
                                <td>{boxscore.home.teamStats.blocked}</td>
                              </tr>
                            </tbody>
                          </table>
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
                              key={p.person.id}
                              id={p.person.id}
                              name={p.person.fullName}
                            />
                          )),
                        )(boxscore.home.players)
                      }
                    </div>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default GamePage;
