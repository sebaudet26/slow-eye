import React from 'react';
import './style.scss';
import {
  isNil,
} from 'ramda';
import { Helmet } from 'react-helmet';
import { fetchBattingLeaders } from '../../../../server/libs/mlbApi.js';
import PlayersTable from '../../../components/Table/mlb/PlayersTable';

export default class MLBPlayerStatsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
    };
  }

  async getPlayers() {
    const players = await fetchBattingLeaders();
    this.setState({
      players,
    });
  }

  componentDidMount() {
    this.getPlayers();
  }


  render() {
    const players = this.state.players.leader_hitting_repeater;
    return (
      <div className="playerStats-page">
        <Helmet>
          <title>MLB Player Stats - Sealstats.com</title>
          <meta
            name="description"
            content="View"
          />
        </Helmet>
        <div className="page-header">
          <div className="container">
            <h2>Player Stats</h2>
          </div>
        </div>
        <div className="container">
          {
            !isNil(players) ? (<PlayersTable players={players.leader_hitting_mux.queryResults} />) : null
          }
        </div>
      </div>
    );
  }
}
