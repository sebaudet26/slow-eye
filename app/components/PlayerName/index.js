import React from 'react';

const PlayerName = ({ id, name }) => (
  (
    <a href={`/player?id=${id}`} style={{ marginRight: '2%' }}>
      {name}
    </a>
  )
);

export default PlayerName;
