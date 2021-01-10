import React from 'react';

const PlayerImage = ({ id, size = '168x168' }) => (
  <img
    src={`https://cms.nhl.bamgrid.com/images/headshots/current/${size}/${id}@2x.png`}
    className="player-img-face"
    onError={ev => ev.target.src = '../../images/avatar.svg'}
  />
);

export default PlayerImage;
