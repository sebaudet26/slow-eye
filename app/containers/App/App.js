import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/Loadable';
import PlayerStatsPage from '../PlayerStatsPage/Loadable';
import StandingsPage from '../StandingsPage/Loadable';
import PlayerPage from '../PlayerPage/Loadable';
import TeamPage from '../TeamPage/Loadable';
import TeamStatsPage from '../TeamStatsPage/Loadable';
import ScorePage from '../ScorePage/Loadable';
import GamePage from '../GamePage/Loadable';
import ContributorsPage from '../Contributors/Loadable';
import HotPlayersPage from '../HotPlayersPage/Loadable';
import PowerRankingsPage from '../PowerRankingsPage/Loadable';
import SealPage from '../SealPage/Loadable';
import BlogPage from '../Blog/Loadable';
import BlogPost from '../Post/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import DraftPage from '../DraftPage/Loadable';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.scss';

class App extends Component {
  componentWillMount() {
    this.props.fetchFeatureFlags();
  }

  render() {
    return (
      <div>
        <Helmet
          defaultTitle="SealStats.com"
        >
          <meta name="description" content="Seal Stats - Hockey Stats" />
        </Helmet>
        <Header />
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
            <Route path="/blog" component={BlogPage} />
            <Route path="/post" component={BlogPost} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
        <div className="app-wrapper">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
