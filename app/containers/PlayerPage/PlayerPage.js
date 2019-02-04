import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  isEmpty, path,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import GameLogTable from '../../components/Table/GameLogTable';
import PlayerBadges from '../../components/PlayerBadges/PlayerBadges';
import PlayerImage from '../../components/PlayerImage';
import { sumNumbers } from '../../utils/player';
import './style.scss';

const rounds = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const urlParams = new URLSearchParams(window.location.search);

const playerIsActiveThisYear = latestSeason => latestSeason.season === '20182019';
const saveToLS = (name, value) => window.localStorage.setItem(name, value);
const getFromLS = name => window.localStorage.getItem(name);
const sumNumbersByPath = ({
  active, isActiveThisYear, lastSeason, careerStats, pathToNumber,
}) => {
  if (active) {
    return isActiveThisYear ? path(pathToNumber, lastSeason) : 0;
  }
  return sumNumbers(careerStats, pathToNumber);
};

export default class PlayerPage extends React.Component {
  componentDidMount() {
    const { fetchPlayer } = this.props;
    fetchPlayer(urlParams.get('id'));
  }

  render() {
    const { player } = this.props;
    if (isEmpty(player)) {
      return (<div />);
    }
    const {
      careerStats = [], careerPlayoffStats = [], info = {}, logs = [],
    } = player;
    const {
      primaryPosition = {},
      currentTeamInfo = {},
      active = {},
      draftInfo = {},
      shootsCatches,
      nationality,
    } = info;
    const lastSeason = careerStats[careerStats.length - 1];
    const isActiveThisYear = playerIsActiveThisYear(lastSeason);
    return (
      <div>
        <Helmet>
          <title>{`${info.firstName} ${info.lastName}`}</title>
          <meta
            name="description"
            content={`${info.firstName} ${info.lastName} stats. Seal Stats is the best place to view NHL stats. User-friendly and fast. `}
          />
        </Helmet>
        <div className="player-header">
          <div className="player-img">
            <PlayerImage id={urlParams.get('id')} />
            <div className="icon-wrapper player-img-country">
              <img src={`/images/country/${nationality}.svg`} className="" />
            </div>
            {
             currentTeamInfo ? (
               <div className="icon-wrapper player-img-team">
                 <img src={`/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
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
                    <p>{`${rounds[draftInfo.round - 1]} Round, #${draftInfo.pickOverall} Overall, ${draftInfo.year} NHL Draft`}</p>
                  </div>
                )}

              </div>
            </div>
            <div className="player-stats">
              <div className="player-stats-item">
                <div className="light small-text">GP</div>
                <div className="bold">
                  {sumNumbersByPath({
                    active,
                    isActiveThisYear,
                    lastSeason,
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
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
                        careerStats,
                        pathToNumber: ['stat', 'wins'],
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">G</div>
                    <div className="bold">
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
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
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
                        careerStats,
                        pathToNumber: ['stat', 'losses'],
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">A</div>
                    <div className="bold">
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
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
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
                        careerStats,
                        pathToNumber: ['stat', 'ot'],
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">Pts</div>
                    <div className="bold">
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
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
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
                        careerStats,
                        pathToNumber: ['stat', 'shutouts'],
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">+/-</div>
                    <div className="bold">
                      {sumNumbersByPath({
                        active,
                        isActiveThisYear,
                        lastSeason,
                        careerStats,
                        pathToNumber: ['stat', 'plusMinus'],
                      })}
                    </div>
                  </div>
                )
              }
              {
                active === true ? (
                  <PlayerBadges info={info} stats={careerStats} logs={logs} />
                ) : null
              }
            </div>
          </div>
        </div>

        <Tabs
          defaultIndex={Number(getFromLS('playerTabIndex')) || 0}
          onSelect={i => saveToLS('playerTabIndex', i)}
        >
          <TabList>
            <Tab>Career Stats</Tab>
            <Tab>Game Logs</Tab>
          </TabList>
          <TabPanel>
            <h3>Season Stats</h3>
            {
              careerStats.length
                ? <CareerStatsTable stats={careerStats} info={info} />
                : null
            }
            {
              careerPlayoffStats.length
                ? (
                  <div>
                    <h3>Playoff Stats</h3>
                    <CareerStatsTable stats={careerPlayoffStats} info={info} />
                  </div>
                ) : null
            }
          </TabPanel>
          { active === true ? (
            <TabPanel>
              <h3>Game Logs</h3>
              <GameLogTable logs={logs} info={info} />
            </TabPanel>
          ) : (
            <TabPanel>
              <div><h2>Player is retired :(</h2></div>
            </TabPanel>
          )}
        </Tabs>
      </div>
    );
  }
}

PlayerPage.propTypes = {
  player: PropTypes.shape({}).isRequired,
  fetchPlayer: PropTypes.func.isRequired,
};
