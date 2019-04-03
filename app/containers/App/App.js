import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import './style.scss';

class App extends Component {
  componentWillMount() {
    this.props.fetchFeatureFlags();
  }

  render() {
    return (
      <Helmet
        defaultTitle="SealStats.com"
      >
        <meta name="description" content="Seal Stats - Hockey Stats" />
      </Helmet>
    );
  }
}

export default App;
