import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Helmet } from 'react-helmet';
import 'sanitize.css/sanitize.css';

// Load the favicon
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./public/images/favicon.ico';
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS reset and Global Styles
import './public/styles/global.scss';

import { Switch, Route, BrowserRouter } from 'react-router-dom';


import Header from './components/Header';
import Footer from './components/Footer';

import NotFoundPage from './containers/NotFoundPage/Loadable';
import TestPage from './containers/Test/Loadable';


// NHL Containers
import HomePage from './containers/nhl/HomePage';
import PlayerStatsPage from './containers/nhl/PlayerStatsPage';
import StandingsPage from './containers/nhl/StandingsPage';
import PlayerPage from './containers/nhl/PlayerPage';
import TeamPage from './containers/nhl/TeamPage';
import TeamStatsPage from './containers/nhl/TeamStatsPage';
import ScorePage from './containers/nhl/ScorePage';
import GamePage from './containers/nhl/GamePage';

// MLB containers

import MLBStandingsPage from './containers/mlb/StandingsPage/Loadable';
import MLBPlayerStatsPage from './containers/mlb/PlayerStatsPage/Loadable';
import MLBPlayerPage from './containers/mlb/PlayerPage/Loadable';
import MLBScorePage from './containers/mlb/ScorePage';

// apollo client setup
const client = new ApolloClient({
  uri: '/graphql',
});

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div>
          <Helmet
            defaultTitle="SealStats.com"
          >
            <meta name="description" content="Seal Stats - Hockey Stats" />
          </Helmet>
          <Header />

          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/test" component={TestPage} />

              // NHL Routes
            <Route path="/standings" component={StandingsPage} />
            <Route path="/playerstats" component={PlayerStatsPage} />
            <Route path="/player" component={PlayerPage} />
            <Route path="/team" component={TeamPage} />
            <Route path="/teamstats" component={TeamStatsPage} />
            <Route path="/scores" component={ScorePage} />
            <Route path="/game" component={GamePage} />

              // MLB Routes
            <Route path="/mlb/standings" component={MLBStandingsPage} />
            <Route path="/mlb/playerstats" component={MLBPlayerStatsPage} />
            <Route path="/mlb/player" component={MLBPlayerPage} />
            <Route path="/mlb/scores" component={MLBScorePage} />

            <Route path="" component={NotFoundPage} />
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    </ApolloProvider>,
    MOUNT_NODE,
  );
};

render();
