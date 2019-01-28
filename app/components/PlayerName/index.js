import React from 'react';

const PlayerName = ({ id, name }) => (
  (
    <a href={`/player?id=${id}`}>
      {name}
    </a>
  )
);

export default PlayerName;
