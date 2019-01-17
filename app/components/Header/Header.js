import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo.svg';
import MobileIcon from './images/hamburger-icon.svg';
import './style.scss';

function burgerToggle() {
  const mobileLinks = document.querySelector('.header-mobile-list');
  if (mobileLinks.style.display === 'block') {
    mobileLinks.style.display = 'none';
  } else {
    mobileLinks.style.display = 'block';
  }
}

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <div className="header-wrapper">
          <a className="header-logo" href="/">
            <img src={Logo} />
            Sealstats
          </a>
          <div className="header-nav">
            <NavLink activeClassName="active" className="header-nav-item" exact to="/">
            Player Stats
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/teamstats">
            Team Stats
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/standings">
            Standings
            </NavLink>
            <NavLink activeClassName="active" className="header-nav-item" to="/scores">
            Scores
            </NavLink>
          </div>
          <div className="header-mobile">
            <img className="header-mobile-icon" src={MobileIcon} alt="" onClick={burgerToggle} />
            <ul className="header-mobile-list">
              <li><NavLink to="/" exact onClick={burgerToggle}>Player Stats</NavLink></li>
              <li><NavLink to="/teamstats" onClick={burgerToggle}>Team Stats</NavLink></li>
              <li><NavLink to="/standings" onClick={burgerToggle}>Standings</NavLink></li>
              <li><NavLink to="/scores" onClick={burgerToggle}>Scores</NavLink></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
