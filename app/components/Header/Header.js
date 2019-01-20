import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo.svg';
import MobileIcon from './images/hamburger-icon.svg';
import ScoreIcon from './images/scoreboard.js';
import StandingsIcon from './images/standings.js';
import StatsIcon from './images/stats.js';
import TeamsIcon from './images/team.js';
import SearchBar from '../SearchBar/SearchBar';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <div className="header-wrapper">
          <a className="header-logo" href="/">
            <img src={Logo} />
            <span className="header-brand">Seal Stats</span>
          </a>
          <SearchBar />
          <div className="header-nav">
            <NavLink activeClassName="active" className="header-nav-item" to="/scores">
            Scores
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/standings">
            Standings
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" exact to="/">
            Player Stats
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/teamstats">
            Team Stats
            </NavLink>
          </div>
          <div className="header-mobile">
            <ul className="header-mobile-list">
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
                <NavLink activeClassName="active" to="/" exact>
                  <StatsIcon />
                  Player Stats
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/teamstats">
                  <TeamsIcon />
                  Team Stats
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
