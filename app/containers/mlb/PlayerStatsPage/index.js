import React from 'react';
import './style.scss';
import {
  isNil, pathOr,
} from 'ramda';
import { Helmet } from 'react-helmet';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { saveToLS, getFromLS } from '../../../utils/localStorage';
import PlayersTable from '../../../components/Table/mlb/PlayersTable';

const fetchBattingLeaders = () => {}
const fetchPitchingLeaders = () => {}
const fetchTeams = () => {}

const urlParams = new URLSearchParams(window.location.search);

export default class MLBPlayerStatsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      hitters: [],
      pitchers: [],
      teams: [],
      selectedLeague: 'MLB',
    };
  }

  async getPlayers() {
    const hitters = await fetchBattingLeaders();
    const pitchers = await fetchPitchingLeaders();
    const teams = await fetchTeams();

    this.setState({
      hitters, pitchers, teams,
    });
  }

  componentDidMount() {
    this.getPlayers();
  }

  render() {
    const hitters = pathOr(null, ['hitters', 'leader_hitting_repeater', 'leader_hitting_mux', 'queryResults'], this.state);
    const pitchers = this.state.pitchers.leader_pitching_repeater;
    const teams = this.state.teams.team_all_season;

    return (
      <div>
        <Header selectedLeague={this.state.selectedLeague} />
        <div className="playerStats-page">
          <Helmet>
            <title>MLB Player Stats - Sealstats.com</title>
            <meta
              name="description"
              content="View"
            />
          </Helmet>
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
            <TabPanel>
              {
              hitters && <PlayersTable type="hitting" teams={teams.queryResults} players={hitters} />
            }
            </TabPanel>
            <TabPanel>
              {
                !isNil(pitchers, teams) ? (<PlayersTable type="pitching" teams={teams.queryResults} players={pitchers.leader_pitching_mux.queryResults} />) : null
              }
            </TabPanel>
          </Tabs>
        </div>
        <Footer />
      </div>
    );
  }
}
