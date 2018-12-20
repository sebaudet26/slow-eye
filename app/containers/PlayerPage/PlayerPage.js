import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'ramda';
import ReactTooltip from 'react-tooltip';
import CareerStatsTable from '../../components/Table/CareerStatsTable';
import {
  isHot,
  isCold,
  isInjured,
  isVeteran,
  pointsInLastGames,
  cumulativePlusMinusInLastGames,
  hotColdGames,
} from '../../utils/calculations';

// Images
import RookieIcon from '../../images/pacifier.svg';
import VeteranIcon from '../../images/veteran.svg';
import InjuryIcon from '../../images/bandage.svg';
import HotIcon from '../../images/fire.svg';
import ColdIcon from '../../images/snowflake.svg';
import './style.scss';

const rounds = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

const urlParams = new URLSearchParams(window.location.search);

const getIsHotText = logs => (`Hot Streak - ${pointsInLastGames(logs)} pts in last ${hotColdGames} games`);
const getPlusMinusText = (logs, pos) => (pos === 'D' ? ` and ${cumulativePlusMinusInLastGames(logs)} ` : '');
const getIsColdText = (logs, pos) => (`Cold Streak - ${pointsInLastGames(logs)} pts${getPlusMinusText(logs, pos)} in last ${hotColdGames} games`);

export default class PlayerPage extends React.Component {
  componentDidMount() {
    const { fetchPlayer } = this.props;
    fetchPlayer(urlParams.get('id'));
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
      rookie,
      nationality,
    } = info;
    const lastSeason = stats[stats.length - 1];
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
          <div className="player-info">
            <h2>{`${info.firstName} ${info.lastName}`}</h2>
            <p>{`${currentTeamInfo.name}, ${primaryPosition.name}, Shoots ${shootsCatches}`}</p>
            <div className="player-desc">
              <div>
                {!draftInfo.team ? <span>Undrafted</span> : (
                  <div>
                    <p>
                      <span className="bold">Drafted by</span>
                      {` Drafted by ${draftInfo.team.name}`}
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
                <div className="bold">{lastSeason.stat.games}</div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text">G</div>
                <div className="bold">{lastSeason.stat.goals}</div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text">A</div>
                <div className="bold">{lastSeason.stat.assists}</div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text">Pts</div>
                <div className="bold">{lastSeason.stat.points}</div>
              </div>
              <div className="player-stats-item">
                <div className="light small-text">+/-</div>
                <div className="bold">{lastSeason.stat.plusMinus}</div>
              </div>
              <div className="player-badges">
                { rookie ? (
                  <div className="icon-wrapper" data-tip="Rookie">
                    <img src={RookieIcon} />
                    <ReactTooltip />
                  </div>
                ) : null }
                { isInjured(info) ? (
                  <div className="icon-wrapper" data-tip="Injured">
                    <img src={InjuryIcon} />
                    <ReactTooltip />
                  </div>
                ) : null }
                { isHot(logs, primaryPosition.abbreviation) ? (
                  <div className="icon-wrapper" data-tip={getIsHotText(logs)}>
                    <img src={HotIcon} />
                    <ReactTooltip />
                  </div>
                ) : null}
                { isCold(logs, primaryPosition.abbreviation) ? (
                  <div className="icon-wrapper" data-tip={getIsColdText(logs, primaryPosition.abbreviation)}>
                    <img src={ColdIcon} />
                    <ReactTooltip />
                  </div>
                ) : null}
                { isVeteran(stats) ? (
                  <div className="icon-wrapper" data-tip="Veteran">
                    <img src={VeteranIcon} />
                    <ReactTooltip />
                  </div>
                ) : null }
              </div>
            </div>
          </div>
          <div className="player-img">
            <img src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${urlParams.get('id')}@2x.png`} className="player-img-face" />
            <div className="icon-wrapper player-img-country">
              <img src={`/images/country/${nationality}.svg`} className="" />
            </div>
            <div className="icon-wrapper player-img-team">
              <img src={`/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
            </div>
          </div>
        </div>
        <h3>Season Stats</h3>
        <CareerStatsTable stats={stats} />
      </div>
    );
  }
}

PlayerPage.propTypes = {
  player: PropTypes.shape({}).isRequired,
  fetchPlayer: PropTypes.func.isRequired,
};
