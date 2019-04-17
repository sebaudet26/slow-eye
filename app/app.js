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

import HomePage from './containers/HomePage/Loadable';
import PlayerStatsPage from './containers/PlayerStatsPage/Loadable';
import StandingsPage from './containers/StandingsPage/Loadable';
import PlayerPage from './containers/PlayerPage/Loadable';
import TeamPage from './containers/TeamPage/Loadable';
import TeamStatsPage from './containers/TeamStatsPage/Loadable';
import ScorePage from './containers/ScorePage/Loadable';
import GamePage from './containers/GamePage/Loadable';
import ContributorsPage from './containers/Contributors/Loadable';
import TestPage from './containers/Test/Loadable';
import HotPlayersPage from './containers/HotPlayersPage/Loadable';
import PowerRankingsPage from './containers/PowerRankingsPage/Loadable';
import SealPage from './containers/SealPage/Loadable';
import NotFoundPage from './containers/NotFoundPage/Loadable';
import DraftPage from './containers/DraftPage/Loadable';

import Header from './components/Header';
import Footer from './components/Footer';


// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

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
          <div className="app-wrapper">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/standings" component={StandingsPage} />
              <Route path="/playerstats" component={PlayerStatsPage} />
              <Route path="/player" component={PlayerPage} />
              <Route path="/team" component={TeamPage} />
              <Route path="/teamstats" component={TeamStatsPage} />
              <Route path="/scores" component={ScorePage} />
              <Route path="/game" component={GamePage} />
              <Route path="/drafts" component={DraftPage} />
              <Route path="/contributors" component={ContributorsPage} />
              <Route path="/powerrankings" component={PowerRankingsPage} />
              <Route path="/hotplayers" component={HotPlayersPage} />
              <Route path="/seal" component={SealPage} />
              <Route path="/test" component={TestPage} />
              <Route path="" component={NotFoundPage} />
            </Switch>
            <Footer />
          </div>
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
