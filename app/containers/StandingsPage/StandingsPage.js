import React from 'react';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import './style.scss';

export default class StandingsPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="standings-page">
        <Helmet>
          <title>Standings</title>
          <meta
            name="description"
            content="Standings"
          />ca
        </Helmet>
        <h2>Standings</h2>
        <h3 className="no-margin-top">Eastern Conference</h3>
        <StandingsTable/>
        <h3>Western Conference</h3>
        <StandingsTable/>
      </div>
    );
  }
}
