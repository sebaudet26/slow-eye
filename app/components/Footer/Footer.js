import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Footer = () => (
  <footer className="footer">
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
    <div className="footer-links">
      <a href="https://www.patreon.com/user?u=12219574" target="_blank">Support us on Patreon</a>
      <Link to="/contributors">
        Contributors
      </Link>
    </div>
  </footer>
);

export default Footer;
