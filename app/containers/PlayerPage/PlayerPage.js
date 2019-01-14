import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import PlayerBadges from '../../components/PlayerBadges/PlayerBadges';
import './style.scss';
import '../../styles/tabs.scss';

const rounds = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

const urlParams = new URLSearchParams(window.location.search);

const playerIsActiveThisYear = latestSeason => latestSeason.season === '20182019';

export default class PlayerPage extends React.Component {
  constructor() {
    super();
    this.onTabSelect = this.onTabSelect.bind(this);
    this.state = {
      tabIndex: Number(window.localStorage.getItem('teamTab') || 0),
    };
  }

  componentDidMount() {
    const { fetchPlayer } = this.props;
    fetchPlayer(urlParams.get('id'));
  }

  onTabSelect(tabIndex) {
    window.localStorage.setItem('teamTab', tabIndex);
    this.setState({ tabIndex });
  }

  render() {
    const { player } = this.props;
    console.log('player', player);
    if (isEmpty(player)) {
      return (<div />);
    }
    const { stats = [], info = {}, logs = [] } = player;
    const {
      primaryPosition = {},
      currentTeamInfo = {},
      draftInfo = {},
      shootsCatches,
      nationality,
    } = info;
    const lastSeason = stats[stats.length - 1];
    const isActiveThisYear = playerIsActiveThisYear(lastSeason);
    return (
      <div>
        <Helmet>
          <title>{`${info.firstName} ${info.lastName}`}</title>
          <meta
            name="description"
            content={`${info.firstName} ${info.lastName}`}
          />
        </Helmet>
        <div className="player-header">
          <div className="player-img">
            <img src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${urlParams.get('id')}@2x.png`} className="player-img-face" />
            <div className="icon-wrapper player-img-country">
              <img src={`/images/country/${nationality}.svg`} className="" />
            </div>
            <div className="icon-wrapper player-img-team">
              <img src={`/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
            </div>
          </div>
          <div className="player-info">
            <h2>{`${info.firstName} ${info.lastName}`}</h2>
            <p>
              <a href={`/team?id=${currentTeamInfo.id}`}>{`${currentTeamInfo.name}`}</a>
,
              {' '}
              {`${primaryPosition.abbreviation}, Shoots ${shootsCatches}`}
            </p>
            <div className="player-desc">
              <div>
                {!draftInfo.team ? <span>Undrafted</span> : (
                  <div>
                    <p>
                      <span className="bold">Drafted by</span>
                      {` ${draftInfo.team.name}`}
                    </p>
                    <p>{`${rounds[draftInfo.round - 1]} Round, #${draftInfo.pickOverall} Overall, ${draftInfo.year} NHL Draft`}</p>
                  </div>
                )}
              </div>
              <div className="player-desc-right">
                <p>
                  <span className="bold">Born</span>
                  {` ${moment(info.birthDate).format('LL')} (${info.currentAge} yrs.) `}
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
            </div>
            <div className="player-stats">
              <div className="player-stats-item">
                <div className="light small-text">GP</div>
                <div className="bold">{isActiveThisYear ? lastSeason.stat.games : 0}</div>
              </div>
              {primaryPosition.abbreviation === 'G'
                ? (
                  <div className="player-stats-item">
                    <div className="light small-text">W</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.wins : 0}</div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">G</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.goals : 0}</div>
                  </div>
                )
              }
              {primaryPosition.abbreviation === 'G'
                ? (
                  <div className="player-stats-item">
                    <div className="light small-text">L</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.losses : 0}</div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">A</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.assists : 0}</div>
                  </div>
                )
              }
              {primaryPosition.abbreviation === 'G'
                ? (
                  <div className="player-stats-item">
                    <div className="light small-text">OT</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.ot : 0}</div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">Pts</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.points : 0}</div>
                  </div>
                )
              }
              {primaryPosition.abbreviation === 'G'
                ? (
                  <div className="player-stats-item">
                    <div className="light small-text">SO</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.shutouts : 0}</div>
                  </div>
                ) : (
                  <div className="player-stats-item">
                    <div className="light small-text">+/-</div>
                    <div className="bold">{isActiveThisYear ? lastSeason.stat.plusMinus : 0}</div>
                  </div>
                )
              }
              <PlayerBadges info={info} stats={stats} logs={logs} />
            </div>
          </div>

        </div>
        <Tabs selectedIndex={this.state.tabIndex} onSelect={this.onTabSelect}>
          <TabList>
            <Tab>Career Stats</Tab>
            <Tab>Game Logs</Tab>
          </TabList>
          <TabPanel>
            <h3>Season Stats</h3>
            <CareerStatsTable stats={stats} info={info} />
          </TabPanel>
          <TabPanel>
            <h3>Game Logs</h3>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

PlayerPage.propTypes = {
  player: PropTypes.shape({}).isRequired,
  fetchPlayer: PropTypes.func.isRequired,
};
