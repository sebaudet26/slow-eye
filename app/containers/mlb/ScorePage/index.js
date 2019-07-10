import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';

export default class TestPage extends React.Component {
  render() {
    return (
      <div className="score-page container">
        <Helmet>
          <title>Score Page</title>
          <meta
            name="description"
            content=""
          />
        </Helmet>
        <h2>This is a test page.</h2>
      </div>
    );
  }
}
