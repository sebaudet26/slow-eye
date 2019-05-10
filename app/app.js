// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';

// Import root app
import App from './containers/App';

// Load the favicon
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS reset and Global Styles
import 'styles/global.scss';

import configureStore from './configureStore';

import { Switch, Route } from 'react-router-dom';


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


// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      {/* <LanguageProvider messages={messages}> */}
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <App />
          <Switch>
            // NHL Routes
            <Route exact path="/" component={HomePage} />
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
            <Route path="/test" component={TestPage} />

            // MLB Routes
            <Route path="/mlb/standings" component={MLBStandingsPage} />
            <Route path="/mlb/playerstats" component={MLBPlayerStatsPage} />

            <Route path="" component={NotFoundPage} />


          </Switch>
          <Footer />
        </div>
      </ConnectedRouter>
      {/* </LanguageProvider> */}
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();
