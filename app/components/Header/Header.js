import React from 'react';
import { Link } from 'react-router-dom';
//import Banner from './images/banner.jpg';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <a className="header-logo" href="/">
          Slow Eye
        </a>
        <div className="nav-bar">
          <Link className="router-link" to="/">
            Player Stats
          </Link>
          <Link className="router-link" to="/teams">
            Team Stats
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
