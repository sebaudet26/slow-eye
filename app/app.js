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
import HomePage from './containers/nhl/HomePage/Loadable';
import PlayerStatsPage from './containers/nhl/PlayerStatsPage/Loadable';
import StandingsPage from './containers/nhl/StandingsPage/Loadable';
import PlayerPage from './containers/nhl/PlayerPage/Loadable';
import TeamPage from './containers/nhl/TeamPage/Loadable';
import TeamStatsPage from './containers/nhl/TeamStatsPage/Loadable';
import ScorePage from './containers/nhl/ScorePage/Loadable';
import GamePage from './containers/nhl/GamePage/Loadable';
import HotPlayersPage from './containers/nhl/HotPlayersPage/Loadable';
import PowerRankingsPage from './containers/nhl/PowerRankingsPage/Loadable';
import DraftPage from './containers/nhl/DraftPage/Loadable';

// MLB containers

import MLBStandingsPage from './containers/mlb/StandingsPage/Loadable';
import MLBPlayerStatsPage from './containers/mlb/PlayerStatsPage/Loadable';
import MLBPlayerPage from './containers/mlb/PlayerPage/Loadable';

// apollo client setup
const client = new ApolloClient({
  uri: `${window.location}graphql`,
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
            <Route path="/drafts" component={DraftPage} />
            <Route path="/powerrankings" component={PowerRankingsPage} />
            <Route path="/hotplayers" component={HotPlayersPage} />

              // MLB Routes
            <Route path="/mlb/standings" component={MLBStandingsPage} />
            <Route path="/mlb/playerstats" component={MLBPlayerStatsPage} />
            <Route path="/mlb/player" component={MLBPlayerPage} />

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
