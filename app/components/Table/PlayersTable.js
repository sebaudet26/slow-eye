import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const makePlayerString = player => (
  <div key={player.id}>{player.person.fullName}</div>
);

class PlayersTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        {players ? players.map(makePlayerString) : null}
      </div>
    );
  }
}

export default PlayersTable;
