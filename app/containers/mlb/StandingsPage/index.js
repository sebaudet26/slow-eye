import React from 'react';
import './style.scss';
import {
  isEmpty,
} from 'ramda';
import { Helmet } from 'react-helmet';
import { fetchStandings } from '../../../../server/libs/mlbApi.js';
import StandingsTable from '../../../components/Table/mlb/StandingsTable';

export default class MLBStandingsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      standings: [],
    };
  }

  async getStandings() {
    const standings = await fetchStandings();
    this.setState({
      standings,
    });
  }

  componentDidMount() {
    this.getStandings();
  }

  render() {
    const standings = this.state.standings;

    return (
      <div className="standings-page">
        <Helmet>
          <title>MLB Standings - Sealstats.com</title>
          <meta
            name="description"
            content=""
          />
        </Helmet>
        <div className="page-header">
          <div className="container">
            <h2>Standings</h2>
          </div>
        </div>
        <div className="container">
          <div>
            {
              !isEmpty(standings) ? (
                <div>
                  <h3 className="no-margin-top">American League</h3>
                  <StandingsTable subStandings={standings.records[1]} />
                  <StandingsTable subStandings={standings.records[2]} />
                  <StandingsTable subStandings={standings.records[0]} />
                  <h3>National League</h3>
                  <StandingsTable subStandings={standings.records[5]} />
                  <StandingsTable subStandings={standings.records[3]} />
                  <StandingsTable subStandings={standings.records[4]} />
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
