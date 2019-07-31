import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  isEmpty, path, reject, filter, contains,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Query } from 'react-apollo';
import { getPlayerQuery } from './query.js';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import CareerStatsTable from '../../../components/Table/CareerStatsTable';
import GameLogTable from '../../../components/Table/GameLogTable';
import PlayerBadges from '../../../components/PlayerBadges/PlayerBadges';
import PlayerImage from '../../../components/PlayerImage';
import {
  sumNumbers, isActiveThisYear, sumStatsByPath, hasNHLExperience,
} from '../../../utils/player';
import { saveToLS, getFromLS } from '../../../utils/localStorage';
import { toOrdinal } from '../../../utils/misc';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));

export default class PlayerPage extends React.Component {
  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <Query query={getPlayerQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />);
            if (error) return (<EmptyState isError />);

            const player = data.player;

            const {
              careerStats = [], careerPlayoffStats = [], info = {}, logs = [], isActive,
            } = player;
            const {
              primaryPosition = {},
              currentTeamInfo = {},
              draftInfo = {},
              shootsCatches,
              nationality,
            } = info;

            const isPro = hasNHLExperience(careerStats);
            const internationalLeagueNames = ['WJC-A', 'WC-A', 'Olympics'];
            const proStats = reject(stat => contains(stat.league.name, internationalLeagueNames))(careerStats);
            const internationalStats = filter(stat => contains(stat.league.name, internationalLeagueNames))(careerStats);

            return (
              <div className="player-page">
                <Helmet>
                  <title>{`${info.firstName} ${info.lastName} - SealStats.com`}</title>
                  <meta
                    name="description"
                    content={`${info.firstName} ${info.lastName} stats. Seal Stats is the best place to view NHL stats. User-friendly and fast. `}
                  />
                </Helmet>
                <div className="page-header wTabs">
                  <div className="container">
                    <div className="player-wrapper">
                      <div className="player-img">
                        <PlayerImage id={urlParams.get('id')} />
                        <div className="icon-wrapper player-img-country">
                          <img src={`/public/images/country/${nationality}.svg`} />
                        </div>
                        {
                       currentTeamInfo ? (
                         <div className="icon-wrapper player-img-team">
                           <img src={`/public/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
                         </div>
                       ) : null
                      }
                      </div>
                      <div className="player-info">
                        <h2>{`${info.firstName} ${info.lastName}`}</h2>
                        <p>
                          {
                          currentTeamInfo ? (
                            <a href={`/team?id=${currentTeamInfo.id}`}>{`${currentTeamInfo.name}, `}</a>
                          ) : null
                        }
                          {`${primaryPosition.abbreviation}, Shoots ${shootsCatches}`}
                        </p>
                        <div className="player-desc">
                          <div>
                            <p>
                              <span className="bold">Born</span>
                              {` ${moment(info.birthDate).format('LL')} (${moment().diff(info.birthDate, 'years')} yrs. ago) `}
                            </p>
                            <p>
                              <span className="bold"> Birthplace</span>
                              {` ${[info.birthCity, info.birthStateProvince || '', info.birthCountry].filter(Boolean).join(', ')} `}
                            </p>
                            <p>
                              <span className="bold">Height</span>
                              {` ${info.height} ft. `}
                              <span className="bold">Weight</span>
                              {` ${info.weight} lbs. `}
                            </p>
                          </div>
                          <div className="player-desc-right">
                            {!draftInfo ? <span>Undrafted</span> : (
                              <div>
                                <p>
                                  <span className="bold">Drafted by</span>
                                  {` ${draftInfo.team.name}`}
                                </p>
                                <p>
                                  <span>{`${toOrdinal(draftInfo.round)}  Round,`}</span>
                                  <span>{`#${draftInfo.pickOverall} Overall, ${draftInfo.year} NHL Draft`}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        { isPro && (
                        <div className="player-stats">
                          <div className="player-stats-item">
                            <div className="light small-text">GP</div>
                            <div className="bold">
                              {sumStatsByPath({
                                isActive,
                                careerStats,
                                pathToNumber: ['stat', 'games'],
                              })}
                            </div>
                          </div>
                          {primaryPosition.abbreviation === 'G'
                            ? (
                              <div className="player-stats-item">
                                <div className="light small-text">W</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'wins'],
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="player-stats-item">
                                <div className="light small-text">G</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'goals'],
                                  })}
                                </div>
                              </div>
                            )
                    }
                          {primaryPosition.abbreviation === 'G'
                            ? (
                              <div className="player-stats-item">
                                <div className="light small-text">L</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'losses'],
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="player-stats-item">
                                <div className="light small-text">A</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'assists'],
                                  })}
                                </div>
                              </div>
                            )
                    }
                          {primaryPosition.abbreviation === 'G'
                            ? (
                              <div className="player-stats-item">
                                <div className="light small-text">OT</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'ot'],
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="player-stats-item">
                                <div className="light small-text">Pts</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'points'],
                                  })}
                                </div>
                              </div>
                            )
                    }
                          {primaryPosition.abbreviation === 'G'
                            ? (
                              <div className="player-stats-item">
                                <div className="light small-text">SO</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'shutouts'],
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="player-stats-item">
                                <div className="light small-text">+/-</div>
                                <div className="bold">
                                  {sumStatsByPath({
                                    isActive,
                                    careerStats,
                                    pathToNumber: ['stat', 'plusMinus'],
                                  })}
                                </div>
                              </div>
                            )
                    }
                          {isActive && <PlayerBadges player={player}/>}
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {
              internationalStats.length || logs.length ? (
                <Tabs
                  defaultIndex={Number(getFromLS(`playerTabIndex${urlParams.get('id')}`)) || 0}
                  onSelect={i => saveToLS(`playerTabIndex${urlParams.get('id')}`, i)}
                >
                  <TabList>
                    <div className="container">
                      <Tab>Career Stats</Tab>
                      {internationalStats.length ? <Tab>International</Tab> : null}
                      {logs.length ? <Tab>Game Logs</Tab> : null}
                    </div>
                  </TabList>
                  <div className="container">
                    {careerStats.length && (
                    <TabPanel>
                      <h3>Season Stats</h3>
                      <CareerStatsTable stats={proStats} info={info} showTotalRow={isPro} />
                      {careerPlayoffStats.length ? (
                        <div>
                          <h3>Playoff Stats</h3>
                          <CareerStatsTable stats={careerPlayoffStats} info={info} showTotalRow={isPro} />
                        </div>
                      ) : null}
                    </TabPanel>
                    )}
                    {internationalStats.length ? (
                      <TabPanel>
                        <h3>International</h3>
                        <CareerStatsTable stats={internationalStats} info={info} showTotalRow />
                      </TabPanel>
                    ) : null}
                    {logs.length ? (
                      <TabPanel>
                        <h3>Game Logs</h3>
                        <GameLogTable logs={logs} info={info} />
                      </TabPanel>
                    ) : null}
                  </div>
                </Tabs>
              ) : (
                <div className="container">
                  <h3>Season Stats</h3>
                  <CareerStatsTable stats={proStats} info={info} showTotalRow={isPro} />
                  <h3>Playoff Stats</h3>
                  <CareerStatsTable stats={careerPlayoffStats} info={info} showTotalRow={isPro} />
                </div>
              )
            }

              </div>
            );
          }}

        </Query>
        <Footer />
      </div>
    );
  }
}
