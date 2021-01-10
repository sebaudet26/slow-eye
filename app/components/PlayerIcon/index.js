import React from 'react';

const PlayerIcon = ({ id }) => (
  <img
    src={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${id}@2x.png`}
    className="options-img"
    onError={ev => ev.target.src = '../../public/images/avatar.svg'}
  />
);

export default PlayerIcon;
