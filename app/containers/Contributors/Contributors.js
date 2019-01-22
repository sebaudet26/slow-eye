import React from 'react';
import './style.scss';
import PatreonLogo from './images/patreon.svg';

export default function NotFound() {
  return (
    <div className="contributor-page">
      <h2>Patreon Contributors</h2>
      <p>Thanks to every one of you who have contributed to Seal Stats - we really appreciate the help. You are all a huge part of this site's success and for this reason, we want to put up your names here. Fore those who haven't contributed yet and want to join the wall of contributors, you can click on the button below.</p>
      <a className="patreon-btn" href="https://www.patreon.com/preview/a07cdea6e7b8461789fad0cccd790415">
        <img src={PatreonLogo} alt="Patreon Logo" />
        Become a Patron
      </a>
    </div>
  );
}
