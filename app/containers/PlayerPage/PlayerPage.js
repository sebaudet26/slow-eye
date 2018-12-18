import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'ramda';

import CareerStatsTable from '../../components/Table/CareerStatsTable';
import PlayerImg from './images/6752.png';
import RookieIcon from '../../images/pacifier2.svg';
import './style.scss';

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
      shootsCatches,
      firstName,
      lastName,
      rookie,
      nationality,
    } = info;
    const lastSeason = stats[stats.length - 1];
    console.log(`/images/country/${nationality}.svg`);
    console.log(`https://assets1.sportsnet.ca/wp-content/uploads/players/nhl/m/${firstName.toLowerCase()}-${lastName.toLowerCase()}.png`);
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
                  {' Colorado Avalanche'}
                </p>
                <p>1st Round, #10 Overall, 2015 NHL Draft</p>
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
                <div className="light">GP</div>
                <div className="bold">
                  {lastSeason.stat.games}
                </div>
              </div>
              <div className="player-stats-item">
                <div className="light">G</div>
                <div className="bold">{lastSeason.stat.goals}</div>
              </div>
              <div className="player-stats-item">
                <div className="light">A</div>
                <div className="bold">{lastSeason.stat.assists}</div>
              </div>
              <div className="player-stats-item">
                <div className="light">Pts</div>
                <div className="bold">{lastSeason.stat.points}</div>
              </div>
              <div className="player-stats-item">
                <div className="light">+/-</div>
                <div className="bold">{lastSeason.stat.plusMinus}</div>
              </div>
              <div className="player-badges">
                { rookie ? (
                  <div className="icon-wrapper">
                    <img src={RookieIcon} />
                  </div>
                ) : null }
              </div>
            </div>
          </div>
          <div className="player-img">
            <img src={PlayerImg} className="player-img-face" />
            <div className="icon-wrapper player-img-country">
              <img src={`/images/country/${nationality}.svg`} className="" />
            </div>
            <div className="icon-wrapper player-img-team">
              <img src={`/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
            </div>
          </div>
        </div>
        <h2>Season Stats</h2>
        <CareerStatsTable stats={stats} />
      </div>
    );
  }
}

PlayerPage.propTypes = {
  player: PropTypes.shape({}).isRequired,
  fetchPlayer: PropTypes.func.isRequired,
};
