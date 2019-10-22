import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import {
  isNil, isEmpty,
} from 'ramda';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CareerStatsTable from '../../../components/Table/mlb/CareerStatsTable';

const fetchPlayer = () => {}
const urlParams = new URLSearchParams(window.location.search);

export default class MLBPlayerPage extends React.Component {
  constructor() {
    super();
    this.state = {
      player: [],
      selectedLeague: 'MLB',
    };
  }

  async getPlayer() {
    const player = await fetchPlayer(urlParams.get('id'));
    this.setState({
      player,
    });
  }

  componentDidMount() {
    this.getPlayer();
  }

  render() {
    const player = this.state.player.people;

    return (isNil(player) ? null : (
      <div>
        <Header selectedLeague={this.state.selectedLeague} />
        <div className="player-page">
          <Helmet>
            <title>{`${player[0].nameFirstLast} - SealStats.com`}</title>
            <meta
              name="description"
              content=""
            />
          </Helmet>
          <div className="page-header">
            <div className="container">
              <div className="player-wrapper">
                <div className="player-img">
                  <img
                    src={`https://securea.mlb.com/mlb/images/players/head_shot/${player[0].id}.jpg`}
                    className="player-img-face"
                  />
                  <div className="icon-wrapper player-img-country">
                    <img src={`/images/country/${player[0].birthCountry}.svg`} />
                  </div>
                  <div className="icon-wrapper player-img-team">
                    <img className="team-cell-logo" src={`https://www.mlbstatic.com/team-logos/${player[0].currentTeam.id}.svg`} />
                  </div>
                </div>
                <div className="player-info">
                  <h2>{player[0].nameFirstLast}</h2>
                  <p>
                    <a href={`/team?id=${player[0].currentTeam.id}`}>{`${player[0].currentTeam.name}, `}</a>
                    {player[0].primaryPosition.abbreviation}
                  </p>
                  <div className="player-desc">
                    <div>
                      <p>
                        <span className="bold">Born</span>
                        {` ${player[0].birthDate}, ${player[0].currentAge}`}
                      </p>
                      <p>
                        <span className="bold"> Birthplace</span>
                        {` ${player[0].birthCity}, ${player[0].birthCountry}`}
                      </p>
                      <p>
                        <span className="bold">Height</span>
                        {` ${player[0].height} ft. `}
                        <span className="bold">Weight</span>
                        {` ${player[0].weight} lbs. `}
                      </p>
                    </div>
                    <div className="player-desc-right">
                      <div>
                        <p>
                          <span className="bold">Drafted </span>
                          {` ${player[0].draftYear}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="player-stats">
                    <div className="player-stats-item">
                      <div className="light small-text">AB</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.atBats}
                      </div>
                    </div>
                    <div className="player-stats-item">
                      <div className="light small-text">H</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.hits}
                      </div>
                    </div>
                    <div className="player-stats-item">
                      <div className="light small-text">AVG</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.avg}
                      </div>
                    </div>
                    <div className="player-stats-item">
                      <div className="light small-text">HR</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.homeRuns}
                      </div>
                    </div>
                    <div className="player-stats-item">
                      <div className="light small-text">RBI</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.rbi}
                      </div>
                    </div>
                    <div className="player-stats-item">
                      <div className="light small-text">SB</div>
                      <div className="bold">
                        {player[0].stats[0].splits[player[0].stats[0].splits.length - 1].stat.stolenBases}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <CareerStatsTable stats={player[0].stats[0].splits} />
          </div>
        </div>
        <Footer />
      </div>
    ));
  }
}
