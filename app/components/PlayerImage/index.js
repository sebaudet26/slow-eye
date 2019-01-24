import React from 'react';

const PlayerImage = ({ id }) => (
  <img
    src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${id}@2x.png`}
    className="player-img-face"
    onError={ev => ev.target.src = '../../images/avatar.svg'}
  />
);

export default PlayerImage;
