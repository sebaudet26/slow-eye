import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class ScorePage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="score-page">
        <Helmet>
          <title>Scores</title>
          <meta
            name="description"
            content="Scores"
          />
        </Helmet>
        <h2>Scores</h2>
      </div>
    );
  }
}
