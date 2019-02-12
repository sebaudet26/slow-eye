import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class HotPlayersPage extends Component {
  render() {
    return (
      <div className="hotPlayers-page">
        <Helmet>
          <title>Who's hot?</title>
          <meta
            name="description"
            content="Who's hot in the NHL right now?"
          />
        </Helmet>
        <h2>Who's hot?</h2>
      </div>
    );
  }
}

export default HotPlayersPage;
