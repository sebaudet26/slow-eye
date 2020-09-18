import React from 'react';
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
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import { saveToLS, getFromLS } from '../../../utils/localStorage';
import { toOrdinal } from '../../../utils/misc';
import BoxTable from '../../../components/Table/BoxTable';
import PlayerName from '../../../components/PlayerName';
import PlayerImage from '../../../components/PlayerImage';
import VideoPlayer from '../../../components/VideoPlayer';

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));

const renderGoalInfo = isShootout => goal => (
  <div key={Math.random()} className="card-cell">
    <div className="goal-image card-cell-item">
      <PlayerImage
        id={goal.scorer.id}
        size="60x60"
      />
      <div className="icon-wrapper">
        <svg className="goal-image-team" key={Math.random()}>
          <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${goal.teamId}-20182019-light`} />
        </svg>
      </div>
    </div>
    <div className="goal-details card-cell-item">
      <div className="goal-details-scorer">
        <PlayerName
          key={goal.scorer.id}
          id={goal.scorer.id}
          name={[
            goal.scorer.name,
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
            name={`${player.name} (${player.seasonTotal})`}
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
      {goal.videoLink ? <VideoPlayer url={goal.videoLink} /> : (<div />)}
    </div>
  </div>
);

const renderPenaltyInfo = penalty => (
  <div key={Math.random()} className="card-cell penalty">
    <div className="card-cell-item penalty-team">
      <svg className="penalty-img" key={Math.random()}>
        <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${penalty.teamId}-20182019-light`} />
      </svg>
      {penalty.periodTime}
    </div>
    <div className="card-cell-item penalty-player">
      <PlayerName
        key={Math.random()}
        id={penalty.player.id}
        name={penalty.player.name}
      />
    </div>
    <div className="card-cell-item penalty-info">
      <span className="hidden-mobile">
        {`${penalty.type} - ${penalty.minutes} mins`}
      </span>
    </div>
  </div>
);

const renderGoalEvents = (goals = [], period) => (
  <div className="card">
    <div className="card-header">
      {
        period === 5 ? 'Shootout'
          : period === 4 ? 'Overtime'
            : `${toOrdinal(period)} Period`
      }
    </div>
    {
      filter(propEq('periodNumber', period), goals).length
        ? map(renderGoalInfo(period === 5), goals)
        : <div className="non-event">No Goals</div>
    }
  </div>
);

const renderPenaltyEvents = (penalties, period) => (
  <div className="card">
    <div className="card-header">
      {period === 4 ? 'Overtime' : `${toOrdinal(period)} Period`}
    </div>
    {
      filter(propEq('periodNumber', period), penalties).length
        ? map(renderPenaltyInfo, filter(event => event.periodNumber === period, penalties))
        : <div className="non-event">No Penalties</div>
    }
  </div>
);

const renderTeamImage = (teamId) => (
  <svg key={Math.random()} className="game-card-team-img">
    <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${teamId}-20182019-light`} />
  </svg>
)

const renderRecapVideo = (recapUrl) => (
  recapUrl ? (
    <VideoPlayer
      url={recapUrl}
      styles={{ textAlign: 'center', width: '100%', marginTop: '5px' }}
    />
  ) : (
    <div className="game-mobile-result">
    :
    </div>
  )
)

class GamePage extends React.Component {
  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <Query query={getGameQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />);
            if (error) return (<EmptyState isError />);
            const game = data.nhl.game;
            console.log('game', game)

            const { 
              awayTeam = {}, 
              homeTeam = {}, 
              goals = [], 
              penalties = [], 
              recap, 
              lastEventPeriod, 
              statusText,
            } = game;

            console.log('goals', goals)

            return (
              <div className="game-page">
                <Helmet
                  titlePrefix={`${awayTeam.teamName} @ ${homeTeam.teamName}`}
                  contentPrefix={`${awayTeam.teamName} vs. ${homeTeam.teamName} game page.`}
                />
                <div className="page-header wTabs">
                  <div className="container">
                    <div className="game-mobile-details">{statusText}</div>
                    <div className="game-header">
                      <div className="game-header-team">
                        {renderTeamImage(awayTeam.teamId)}
                        <div className="game-header-team-name">
                          <div className="city">{awayTeam.location}</div>
                          <div className="team">{awayTeam.teamName}</div>
                          <div className="record">
                            {`${awayTeam.wins}-${awayTeam.losses}-${awayTeam.ot}`}
                            {` ${awayTeam.pts}pts`}
                          </div>
                        </div>
                        <div className="game-header-team-score">
                          {awayTeam.teamStats.goals + ('shootoutSummary' && 'shootoutSummary.away.scores > shootoutSummary.home.scores' ? 1 : 0)}
                        </div>
                      </div>
                      <div className="game-header-result">
                        <div className="hidden-mobile">
                          <div>
                            {statusText}
                          </div>
                        </div>
                        {renderRecapVideo()}
                      </div>
                      <div className="game-header-team">
                        <div className="game-header-team-score">
                          {homeTeam.teamStats.goals + ('shootoutSummary' && 'shootoutSummary.home.scores > shootoutSummary.away.scores' ? 1 : 0)}
                        </div>
                        <div className="game-header-team-name">
                          <div className="city">{homeTeam.location}</div>
                          <div className="team">{homeTeam.teamName}</div>
                          <div className="record">
                            {`${homeTeam.wins}-${homeTeam.losses}-${homeTeam.ot}`}
                            {` ${homeTeam.pts}pts`}
                          </div>
                        </div>
                        {renderTeamImage(homeTeam.teamId)}
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
                        <Tab>{awayTeam.teamName}</Tab>
                        <Tab>Summary</Tab>
                        <Tab>{homeTeam.teamName}</Tab>
                      </div>
                    </div>
                  </TabList>
                  <div className="container">
                    <TabPanel>
                      <BoxTable
                        players={reject(isScratchedOrGoalie, homeTeam.playerStats)}
                        goalieMode={false}
                      />
                      <BoxTable
                        players={filter(isGoalie, awayTeam.playerStats)}
                        goalieMode
                      />
                    </TabPanel>
                    <TabPanel>
                      <div className="summary">
                        <div className="summary-col">
                          <h3>Scoring</h3>
                          {renderGoalEvents(goals, 1)}
                          {renderGoalEvents(goals, 2)}
                          {renderGoalEvents(goals, 3)}
                          {
                              (lastEventPeriod === 4 || lastEventPeriod === 5)
                              ? renderGoalEvents(goals, 4)
                              : null
                          }
                          {
                              lastEventPeriod.period === 5
                              ? renderGoalEvents(goals, 5)
                              : null
                          }
                          <h3>Penalties</h3>
                          {renderPenaltyEvents(penalties, 1)}
                          {renderPenaltyEvents(penalties, 2)}
                          {renderPenaltyEvents(penalties, 3)}
                          {
                              (lastEventPeriod === 4 || lastEventPeriod === 5)
                              ? renderPenaltyEvents(penalties, 4)
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
                                  <th>{renderTeamImage(awayTeam.teamId)}</th>
                                  <th>{renderTeamImage(homeTeam.teamId)}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{'Shots'}</td>
                                  <td>{awayTeam.teamStats.shots}</td>
                                  <td>{homeTeam.teamStats.shots}</td>
                                </tr>
                                <tr>
                                  <td>{'PIM'}</td>
                                  <td>{awayTeam.teamStats.pim}</td>
                                  <td>{homeTeam.teamStats.pim}</td>
                                </tr>
                                <tr>
                                  <td>{'PP'}</td>
                                  <td>{`${awayTeam.teamStats.powerPlayGoals}/${awayTeam.teamStats.powerPlayOpportunities}`}</td>
                                  <td>{`${homeTeam.teamStats.powerPlayGoals}/${homeTeam.teamStats.powerPlayOpportunities}`}</td>
                                </tr>
                                <tr>
                                  <td>{'Hits'}</td>
                                  <td>{awayTeam.teamStats.hits}</td>
                                  <td>{homeTeam.teamStats.hits}</td>
                                </tr>
                                <tr>
                                  <td>{'FO%'}</td>
                                  <td>{awayTeam.teamStats.faceOffWinPercentage.toFixed()}</td>
                                  <td>{homeTeam.teamStats.faceOffWinPercentage.toFixed()}</td>
                                </tr>
                                <tr>
                                  <td>{'TK'}</td>
                                  <td>{awayTeam.teamStats.takeaways}</td>
                                  <td>{homeTeam.teamStats.takeaways}</td>
                                </tr>
                                <tr>
                                  <td>{'GV'}</td>
                                  <td>{awayTeam.teamStats.giveaways}</td>
                                  <td>{homeTeam.teamStats.giveaways}</td>
                                </tr>
                                <tr>
                                  <td>{'Bks'}</td>
                                  <td>{awayTeam.teamStats.blocked}</td>
                                  <td>{homeTeam.teamStats.blocked}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <BoxTable
                        players={reject(isScratchedOrGoalie, homeTeam.playerStats)}
                        goalieMode={false}
                      />
                      <BoxTable
                        players={filter(isGoalie, homeTeam.playerStats)}
                        goalieMode
                      />
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            );
          }}
        </Query>
        <Footer />
      </div>
    );
  }
}

export default GamePage;
