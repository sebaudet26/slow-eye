import React from 'react';

const TeamLogo = ({ teamId, season }) => (
  <svg key={Math.random()} className="team-cell-logo">
    <use xlinkHref={`/public/images/teams/season/${season}.svg#team-${teamId}-${season}-light`} />
  </svg>
);

export default TeamLogo;
