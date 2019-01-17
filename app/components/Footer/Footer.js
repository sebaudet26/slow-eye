import React from 'react';
import './style.scss';

const Footer = () => (
  <footer>
    <section>
      {'Made with'}
      <span role="img" aria-label="heart-emoji"> ❤️ </span>
      {'by '}
      <span className="bold">SE</span>
b and
      {' '}
      <span className="bold">AL</span>
ex
    </section>
  </footer>
);

export default Footer;
