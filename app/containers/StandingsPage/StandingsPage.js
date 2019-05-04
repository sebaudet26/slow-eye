import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import StandingsTable from '../../components/Table/StandingsTable';
import './style.scss';

export default class StandingsPage extends React.Component {
  componentDidMount() {
    const { fetchStandings } = this.props;
    fetchStandings();
  }


  render() {
    const { standings } = this.props;
    return (
      <div className="standings-page">
        <div className="page-header">
          <div className="container">
            <h2>Standings</h2>
          </div>
        </div>
        <div className="container">
          <Helmet>
            <title>NHL Standings - SealStats.com</title>
            <meta
              name="description"
              content="View NHL Standings. Seal Stats is the best place to view NHL stats. User-friendly and fast."
            />
          </Helmet>

          <StandingsTable standings={standings} />
        </div>
      </div>
    );
  }
}

StandingsPage.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchStandings: PropTypes.func.isRequired,
};
