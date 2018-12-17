import React from 'react';
import './style.scss';

const Footer = () => (
  <footer>
    <section>
      {'Made with'}
      <span role="img" aria-label="heart-emoji">❤️</span>
      {' by'}
      <a rel="noopener noreferrer" target="_blank" href="http://chatler.io">Seb and Alex</a>
    </section>
  </footer>
);

export default Footer;
