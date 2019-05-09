import React from 'react';
import './style.scss';
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
          {console.log(standings)}
          <StandingsTable standings={standings} />
        </div>
      </div>
    );
  }
}
