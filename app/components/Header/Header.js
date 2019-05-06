import React from 'react';
import { NavLink } from 'react-router-dom';
// import Logo from '../../images/logo.svg';
import HomeIcon from './images/home';
import ScoreIcon from './images/scoreboard';
import StandingsIcon from './images/standings';
import StatsIcon from './images/stats';
import TeamsIcon from './images/team';
import SearchBar from '../SearchBar/SearchBar';
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown';
import Logo from '../../images/Logo.js';

import './style.scss';


class Header extends React.Component {
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
          <a className="header-brand" href="/">
            <Logo />
            <span className="header-brand-name">Sealstats</span>
          </a>
          <SearchBar />
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
