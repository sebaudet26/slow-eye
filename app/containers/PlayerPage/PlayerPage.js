import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  isEmpty, sum, map, pathOr,
} from 'ramda';
import ReactTooltip from 'react-tooltip';
import CareerStatsTable from '../../components/Table/CareerStatsTable';

// Images
import PlayerImg from '../../images/avatar.svg';
import RookieIcon from '../../images/pacifier.svg';
import VeteranIcon from '../../images/veteran.svg';
import InjuryIcon from '../../images/bandage.svg';
import HotIcon from '../../images/fire.svg';
import ColdIcon from '../../images/snowflake.svg';
import './style.scss';

const rounds = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

const urlParams = new URLSearchParams(window.location.search);

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
    const { stats = [], info = {} } = player;
    const {
      primaryPosition = {},
      currentTeamInfo = {},
      draftInfo = {},
      shootsCatches,
      firstName,
      lastName,
      rookie,
      nationality,
    } = info;
    const lastSeason = stats[stats.length - 1];
    // console.log(`/images/country/${nationality}.svg`);
    // console.log(`https://assets1.sportsnet.ca/wp-content/uploads/players/nhl/m/${firstName.toLowerCase()}-${lastName.toLowerCase()}.png`);
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
                <p>
                  <span className="bold">Drafted by</span>
                  {` Drafted by ${draftInfo.team.name}`}
                </p>
                <p>{`${rounds[draftInfo.round - 1]} Round, #${draftInfo.pickOverall} Overall, ${draftInfo.year} NHL Draft`}</p>
              </div>
              <div className="player-desc-right">
                <p>
                  <span className="bold">Born</span>
                  {` ${moment(info.birthDate).format('LL')} (${info.currentAge} yrs.) `}
                  <span className="bold">Birthplace</span>
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
                { info.rosterStatus === 'I' ? (
                  <div className="icon-wrapper" data-tip="Injured">
                    <img src={InjuryIcon} />
                    <ReactTooltip />
                  </div>
                ) : null }
                <div className="icon-wrapper" data-tip="Hot Streak">
                  <img src={HotIcon} />
                  <ReactTooltip />
                </div>
                <div className="icon-wrapper" data-tip="Cold Streak">
                  <img src={ColdIcon} />
                  <ReactTooltip />
                </div>
                { sum(map(pathOr(0, ['stat', 'games']), stats)) > 500 ? (
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
