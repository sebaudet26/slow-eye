import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default class TestPage extends React.Component {
  constructor() {
    super();
    this.state = {
      standings: [],
      selectedLeague: 'MLB',
    };
  }

  render() {
    return (
      <div>
        <Header selectedLeague={this.state.selectedLeague} />
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
        <Footer />
      </div>
    );
  }
}
