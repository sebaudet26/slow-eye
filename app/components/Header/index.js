import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from './images/home';
import ScoreIcon from './images/scoreboard';
import StandingsIcon from './images/standings';
import StatsIcon from './images/stats';
import TeamsIcon from './images/team';
import SearchBar from '../SearchBar/SearchBar';
import LeagueSwitch from '../LeagueSwitch/LeagueSwitch';
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown';
import { saveToLS, getFromLS } from '../../utils/localStorage';
import Logo from '../../public/images/Logo.js';

import './style.scss';


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLeague: this.props.selectedLeague,
    };

    this.switchLeague = this.switchLeague.bind(this);
  }

  componentDidUpdate() {
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

    const NHLHomeLink = '/';
    const MLBHomeLink = '/mlb/standings';

    return (
      <div className="header">
        <div className="header-wrapper">
          <NavLink
            className="header-brand"
            to={this.state.selectedLeague === 'NHL' ? NHLHomeLink : MLBHomeLink}
          >
            <Logo />
            <span className="header-brand-name">Sealstats</span>
          </NavLink>
          <LeagueSwitch league={this.state.selectedLeague} switchLeague={this.switchLeague.bind(this)} />
          {this.state.selectedLeague === 'NHL' ? (<SearchBar />) : null}
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
              </div>
            ) : (
              <div className="header-nav">
                <NavLink activeClassName="active" className="header-nav-item" exact to="/mlb/standings">
                  Standings
                </NavLink>
                <NavLink activeClassName="active" className="header-nav-item" exact to="/mlb/playerstats">
                  Player Stats
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
