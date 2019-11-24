import React from 'react';
import {
  sumNumbers, sumStatsByPath,
} from '../../../utils/player';
import PlayerBadges from '../../../components/PlayerBadges/PlayerBadges';

const commonStats = [
  { label: 'GP', pathToValue: ['games'] },
];

const goalieStats = [
  { label: 'W', pathToValue: ['goalieStats', 'wins'] },
  { label: 'L', pathToValue: ['goalieStats', 'losses'] },
  { label: 'OT', pathToValue: ['goalieStats', 'ot'] },
  { label: 'SO', pathToValue: ['goalieStats', 'shutouts'] },
];

const skaterStats = [
  { label: 'G', pathToValue: ['offensive', 'goals'] },
  { label: 'A', pathToValue: ['offensive', 'assists'] },
  { label: 'Pts', pathToValue: ['offensive', 'points'] },
  { label: '+/-', pathToValue: ['defensive', 'plusMinus'] },
]

const renderCareerStat = ({ isActive, career }) => ({ pathToValue, label }) => (
  <div className="player-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">
      {sumStatsByPath({
        isActive,
        stats: career.seasons,
        pathToNumber: pathToValue,
      })}
    </div>
  </div>
);

class CareerSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { player } = this.props
    const { career, position, status } = player
    const { isGoalie } = position
    const { isActive } = status

    const specificStats = isGoalie ? goalieStats : skaterStats

    return (
      <div className="player-stats">
        {[...commonStats, ...specificStats].map(renderCareerStat({ isActive, career }))}
        {isActive && <PlayerBadges player={player} />}
      </div>
    );
  }
}

export default CareerSummary;
