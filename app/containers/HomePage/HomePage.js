import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import './style.scss';

export default class HomePage extends React.Component {
  render() {
    return (
      <div className="home-page">
        <Helmet>
          <title>Standings</title>
          <meta
            name="description"
            content="Seal Stats is the best place to view NHL stats. User-friendly and fast."
          />
        </Helmet>
        <h2>Homepage</h2>
      </div>
    );
  }
}
