import React from 'react';
import './style.scss';
import {
  isNil,
} from 'ramda';
import { Helmet } from 'react-helmet';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { saveToLS, getFromLS } from '../../../utils/localStorage';
import { fetchBattingLeaders, fetchPitchingLeaders } from '../../../../server/libs/mlbApi.js';
import PlayersTable from '../../../components/Table/mlb/PlayersTable';

const urlParams = new URLSearchParams(window.location.search);

export default class MLBPlayerStatsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      hitters: [],
      pitchers: [],
    };
  }

  async getPlayers() {
    const hitters = await fetchBattingLeaders();
    const pitchers = await fetchPitchingLeaders();
    this.setState({
      hitters, pitchers,
    });
  }

  componentDidMount() {
    this.getPlayers();
  }

  render() {
    const hitters = this.state.hitters.leader_hitting_repeater;
    const pitchers = this.state.pitchers.leader_pitching_repeater;
    console.log(pitchers);
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
        <Tabs
          defaultIndex={Number(getFromLS(`playerTabIndex${urlParams.get('id')}`)) || 0}
          onSelect={i => saveToLS(`playerTabIndex${urlParams.get('id')}`, i)}
        >
          <TabList>
            <div className="container">
              <Tab>Hitting</Tab>
              <Tab>Pitching</Tab>
            </div>
          </TabList>
          <div className="container">
            <TabPanel>
              {
                !isNil(hitters) ? (<PlayersTable type="hitting" players={hitters.leader_hitting_mux.queryResults} />) : null
              }
            </TabPanel>
            <TabPanel>
              {
                !isNil(pitchers) ? (<PlayersTable type="pitching" players={pitchers.leader_pitching_mux.queryResults} />) : null
              }
            </TabPanel>
          </div>
        </Tabs>
      </div>
    );
  }
}
