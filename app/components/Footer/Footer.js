import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import PatreonLogo from './images/patreon.svg';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div>
        {'Made with'}
        <span role="img" aria-label="heart-emoji"> ❤️ </span>
        {'by '}
        <span className="bold">SE</span>
b and
        {' '}
        <span className="bold">AL</span>
ex
      </div>
    </div>
  </footer>
);

export default Footer;
