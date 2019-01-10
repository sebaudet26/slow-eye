import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import TeamsTable from '../../components/Table/TeamsTable';
import './style.scss';

export default class TeamStatsPage extends React.Component {
  render() {
    return (
      <div className="teamStats-page">
        <Helmet>
          <title>Team Stats</title>
          <meta name="description" content="Quick Stats" />
        </Helmet>
        <div className="teamStats-page">
          <h2>Team Stats</h2>
          <TeamsTable/>
        </div>
      </div>
    );
  }
}
