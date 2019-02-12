import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class PowerRankingsPage extends Component {
  render() {
    return (
      <div className="hotTeams-page">
        <Helmet>
          <title>Power Rankings</title>
          <meta
            name="description"
            content="Power Rankings"
          />
        </Helmet>
        <h2>Power Rankings</h2>
      </div>
    );
  }
}

export default PowerRankingsPage;
