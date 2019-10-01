import React from 'react';
import {
  sumNumbers, sumStatsByPath,
} from '../../../utils/player';
import PlayerBadges from '../../../components/PlayerBadges/PlayerBadges';

const commonStats = [
  { label: 'GP', pathToValue: ['stat', 'games'] },
];

const goalieStats = [
  { label: 'W', pathToValue: ['stat', 'wins'] },
  { label: 'L', pathToValue: ['stat', 'losses'] },
  { label: 'OT', pathToValue: ['stat', 'ot'] },
  { label: 'SO', pathToValue: ['stat', 'shutouts'] },
];

const skaterStats = [
  { label: 'G', pathToValue: ['stat', 'goals'] },
  { label: 'A', pathToValue: ['stat', 'assists'] },
  { label: 'Pts', pathToValue: ['stat', 'points'] },
  { label: '+/-', pathToValue: ['stat', 'plusMinus'] },
]

const renderCareerStat = ({ isActive, careerStats }) => ({ pathToValue, label }) => (
  <div className="player-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">
      {sumStatsByPath({
        isActive,
        careerStats,
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
    const { player } = this.props;
    const { careerStats, isActive } = player;

    const specificStats = player.info.isGoalie ? goalieStats : skaterStats;
    return (
      <div className="player-stats">
        {[...commonStats, ...specificStats].map(renderCareerStat({ isActive, careerStats }))}
        {isActive && <PlayerBadges player={player} />}
      </div>
    );
  }
}

export default CareerSummary;
