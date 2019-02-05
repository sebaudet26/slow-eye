import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo.svg';
import ScoreIcon from './images/scoreboard';
import StandingsIcon from './images/standings';
import StatsIcon from './images/stats';
import TeamsIcon from './images/team';
import SearchBar from '../SearchBar/SearchBar';

import './style.scss';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="header-wrapper">
          <a className="header-logo" href="/">
            <img src={Logo} alt="" />
            <span className="header-brand">Seal Stats</span>
          </a>
          <SearchBar />
          <div className="header-nav">
            <NavLink activeClassName="active" className="header-nav-item" exact to="/">
              Home
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" exact to="/standings">
              Standings
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/scores">
                Scores
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/playerstats">
                Player Stats
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/teamstats">
                Team Stats
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/drafts">
                Drafts
            </NavLink>
          </div>
          <div className="header-mobile">
            <ul className="header-mobile-list">
              <li>
                <NavLink activeClassName="active" exact to="/">
                  <StandingsIcon />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/standings">
                  <StandingsIcon />
                    Standings
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/scores">
                  <ScoreIcon />
                      Scores
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/playerstats">
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
