import React from 'react';
import PlayerImage from '../PlayerImage';

const PlayerName = ({
  id, name, withImage, url,
}) => (
  (
    <a href={url} style={{ marginRight: '1%' }}>
      { withImage ? (
        <PlayerImage id={id} size="60x60" />
      ) : null}
      {name}
    </a>
  )
);

export default PlayerName;
