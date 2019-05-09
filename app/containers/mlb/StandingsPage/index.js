import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { fetchStandings } from '../../../../server/libs/mlbApi.js';

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
    return (
      <div className="standings-page">
        <Helmet>
          <title>Test</title>
          <meta
            name="description"
            content="Thank you to all Patreon Contributors"
          />
        </Helmet>
        <div className="page-header">
          <div className="container">
            <h2>Standings</h2>
          </div>
        </div>
        <div className="container">
          {JSON.stringify(this.state.standings)}
        </div>
      </div>
    );
  }
}
