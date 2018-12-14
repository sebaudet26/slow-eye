import React from 'react';
import { NavLink } from 'react-router-dom';
import MobileIcon from './images/hamburger-icon.svg';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <a className="header-logo" href="/">
          Slow Eye
        </a>
        <div className="header-nav">
          <NavLink activeClassName="active" className="header-nav-item" exact to="/">
            Player Stats
          </NavLink>
          <NavLink activeClassName="active" className="header-nav-item" to="/teams">
            Team Stats
          </NavLink>
        </div>
        <div className="header-mobile">
          <img className="header-mobile-icon" src={MobileIcon} alt="" onClick={this.burgerToggle} />
          <ul className="header-mobile-list">
            <li><NavLink to='/' exact onClick={this.burgerToggle}>Player Stats</NavLink></li>
            <li><NavLink to='/teams' onClick={this.burgerToggle}>Team Stats</NavLink></li>
          </ul>
        </div>
      </div>
    );
  }
  burgerToggle() {
		let mobileLinks = document.querySelector('.header-mobile-list');
		if (mobileLinks.style.display === 'block') {
			mobileLinks.style.display = 'none';
		} else {
			mobileLinks.style.display = 'block';
		}
	}
}

export default Header;
