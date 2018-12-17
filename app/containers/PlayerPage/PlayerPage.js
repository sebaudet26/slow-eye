import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class PlayerPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Mikko Rantanen</title>
          <meta
            name="description"
            content="Mikko Rantanen"
          />
        </Helmet>
        <h1>Mikko Rantanen</h1>
      </div>
    );
  }
}
