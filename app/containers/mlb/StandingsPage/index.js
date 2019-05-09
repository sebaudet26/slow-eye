import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';

export default class MLBStandingsPage extends React.Component {
  render() {
    return (
      <div className="contributor-page container">
        <Helmet>
          <title>Test</title>
          <meta
            name="description"
            content="Thank you to all Patreon Contributors"
          />
        </Helmet>
        <h2>Ok got this</h2>
      </div>
    );
  }
}
