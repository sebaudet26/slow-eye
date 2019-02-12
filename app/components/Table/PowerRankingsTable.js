/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class PowerRankingsTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactTableFixedColumns
          resizable={false}
          noDataText="Loading all that good stuff..."
          columns={[
            {
              Header: '#',
              id: 'rank',
              className: 'text-left',
              maxWidth: 30,
              minWidth: 30,
              fixed: 'left',
              sortable: false,
            },
            {
              Header: 'Team',
              id: 'name',
              className: 'text-left team-cell',
              maxWidth: 300,
              minWidth: 125,
              fixed: 'left',
            },
            {
              Header: 'GP',
              id: 'gamesPlayed',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'W',
              id: 'wins',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'L',
              id: 'losses',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'OT',
              id: 'ot',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'P%',
              id: 'ptsPctg',
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'GF',
              id: 'goalsfor',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GA',
              id: 'goalsagainst',
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GF/GP',
              id: 'goalsPerGame',
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'GA/GP',
              id: 'goalsAgainstPerGame',
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'Diff.',
              id: 'goaldiff',
              maxWidth: 65,
              minWidth: 55,
              sortMethod: (a, b) => (Number(a) > Number(b) ? 1 : -1),
            },
            {
              Header: 'PP%',
              id: 'powerPlayPercentage',
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'PK%',
              id: 'penaltyKillPercentage',
              maxWidth: 65,
              minWidth: 55,
            },
          ]}
          defaultSortDesc
          defaultPageSize={31}
          showPagination={false}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          className="-striped teams-table"
        />
      </div>
    );
  }
}

PowerRankingsTable.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PowerRankingsTable;
