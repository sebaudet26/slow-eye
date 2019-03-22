import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HotTable from '../../components/Table/HotTable';
import './style.scss';

class HotPlayersPage extends Component {
  componentWillMount() {
    const { fetchHotPlayers } = this.props;
    fetchHotPlayers();
  }

  render() {
    const { hotPlayers } = this.props;
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
          {`Who's hot?${this.props.features.someFlag ? ' Seb is Fucking hot' : ''}`}
        </h2>
        <HotTable players={hotPlayers} />
      </div>
    );
  }
}

export default HotPlayersPage;
