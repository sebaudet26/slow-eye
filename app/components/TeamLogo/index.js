import React from 'react';

const TeamLogo = ({ teamId, season, teamAbrv }) => {
  if (teamAbrv) {
    const src = `/public/images/teams/small/${teamAbrv}.png`
    return (
      <img key={Math.random()} className="team-cell-logo" src={src}></img>
    )
  } else {
    return (
      <svg key={Math.random()} className="team-cell-logo">
        <use xlinkHref={`/public/images/teams/season/${season}.svg#team-${teamId}-${season}-light`} />
      </svg>
    );
  }
}

export default TeamLogo;
