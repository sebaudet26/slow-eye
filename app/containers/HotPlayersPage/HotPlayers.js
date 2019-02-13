import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FireIcon from '../../images/fire.svg';
import HotTable from '../../components/Table/HotTable';
import './style.scss';

class HotPlayersPage extends Component {
  render() {
    return (
      <div className="hotPlayers-page">
        <Helmet>
          <title>Who's hot? - SealStats.com</title>
          <meta
            name="description"
            content="Who's hot in the NHL right now?"
          />
        </Helmet>
        <h2>
          <div className="icon-wrapper">
            <img src={FireIcon} />
          </div>
            Who's hot?
        </h2>
        <HotTable />
      </div>
    );
  }
}

export default HotPlayersPage;
