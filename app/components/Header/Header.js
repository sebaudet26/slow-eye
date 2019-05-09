import React from 'react';
import { NavLink } from 'react-router-dom';
// import Logo from '../../images/logo.svg';
import HomeIcon from './images/home';
import ScoreIcon from './images/scoreboard';
import StandingsIcon from './images/standings';
import StatsIcon from './images/stats';
import TeamsIcon from './images/team';
import SearchBar from '../SearchBar/SearchBar';
import LeagueSwitch from '../LeagueSwitch/LeagueSwitch';
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown';
import { saveToLS, getFromLS } from '../../utils/localStorage';
import Logo from '../../images/Logo.js';

import './style.scss';


class Header extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedLeague: 'NHL',
      ...JSON.parse(getFromLS('headerState') || '{}'),
    };

    this.switchLeague = this.switchLeague.bind(this);
  }

  componentDidUpdate() {
    saveToLS('headerState', JSON.stringify(this.state));
  }

  switchLeague(event) {
    this.setState({
      selectedLeague: event.currentTarget.dataset.id,
    });
  }

  render() {
    const statsDropdown = [
      {
        name: 'Player Stats',
        link: '/playerstats',
      },
      {
        name: 'Team Stats',
        link: '/teamstats',
      },
    ];

    const moreDropdown = [
      {
        name: 'Power Rankings',
        link: '/powerrankings',
      },
      {
        name: 'Hot Players',
        link: '/hotplayers',
      },
      {
        name: 'NHL Entry Draft',
        link: '/drafts',
      },
    ];
    return (
      <div className="header">
        <div className="header-wrapper">
          <NavLink className="header-brand" to="/">
            <Logo />
            <span className="header-brand-name">Sealstats</span>
          </NavLink>
          <LeagueSwitch league={this.state.selectedLeague} switchLeague={this.switchLeague.bind(this)} />
          <SearchBar />
          {
            this.state.selectedLeague === 'NHL' ? (
              <div className="header-nav">
                <NavLink activeClassName="active" className="header-nav-item" to="/scores">
                Scores
                </NavLink>
                <NavLink activeClassName="active" className="header-nav-item" exact to="/standings">
                Standings
                </NavLink>
                <HeaderDropdown name="Stats" list={statsDropdown} />
                <HeaderDropdown name="More" list={moreDropdown} />
              </div>
            ) : (
              <div className="header-nav">
                <NavLink activeClassName="active" className="header-nav-item" exact to="/mlb/standings">
                  Standings
                </NavLink>
              </div>
            )
          }
          <div className="header-mobile">
            <ul className="header-mobile-list">
              <li>
                <NavLink activeClassName="active" exact to="/">
                  <HomeIcon />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/scores">
                  <ScoreIcon />
                  Scores
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/standings">
                  <StandingsIcon />
                  Standings
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/playerstats">
                  <StatsIcon />
                  Leaders
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
