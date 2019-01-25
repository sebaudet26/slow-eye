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
        <Helmet>
          <title>Standings</title>
          <meta
            name="description"
            content="Standings"
          />
        </Helmet>
        <h2>Standings</h2>
        <StandingsTable standings={standings} />
      </div>
    );
  }
}

StandingsPage.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchStandings: PropTypes.func.isRequired,
};
