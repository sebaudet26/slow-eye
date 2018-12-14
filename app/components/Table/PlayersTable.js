import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

class PlayersTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTable
          data={players}
          columns={[
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => d.person.fullName,
            },
            {
              Header: 'Goals',
              id: 'goals',
              accessor: d => d.stats[0].stat.goals || 0,
              className: 'center',
            },
            {
              Header: 'Assists',
              id: 'assists',
              accessor: d => d.stats[0].stat.assists || 0,
              className: 'center',
            },
            {
              Header: 'Points',
              id: 'points',
              accessor: d => d.stats[0].stat.points || 0,
              className: 'center',
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default PlayersTable;
