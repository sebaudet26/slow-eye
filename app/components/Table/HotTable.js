/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import {
  last, pipe, pathOr, invoker,
} from 'ramda';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const HotTable = ({ players, position }) => (
  <div>
    <ReactTableFixedColumns
      resizable={false}
      noDataText="Loading all good stuff..."
      columns={[
        {
          Header: '#',
          id: 'rank',
          Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
          className: 'text-left',
          sortable: false,
          fixed: 'left',
          maxWidth: 30,
          minWidth: 30,
        },
        {
          Header: 'Name',
          id: 'fullName',
          className: 'text-left',
          fixed: 'left',
          maxWidth: 200,
          minWidth: 150,
        },
        {
          Header: 'Pos',
          id: 'position',
          className: 'text-left hidden-mobile',
          maxWidth: 50,
          minWidth: 50,
          fixed: 'left',
        },
        {
          Header: 'Team',
          id: 'team',
          className: 'text-left team-cell sm-margin hidden-mobile',
          maxWidth: 85,
          minWidth: 75,
          fixed: 'left',
        },
        {
          Header: 'GP',
          id: 'games',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'G',
          id: 'goals',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'A',
          id: 'assists',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'Pts',
          id: 'points',
          maxWidth: 75,
          minWidth: 45,
        },
        {
          Header: 'Pts/GP',
          id: 'pointsPerGame',
          maxWidth: 75,
          minWidth: 60,
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'pim',
          maxWidth: 55,
          minWidth: 50,
        },
        {
          Header: 'PPG',
          id: 'powerPlayGoals',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SHG',
          id: 'shortHandedGoals',
          maxWidth: 75,
          minWidth: 50,
        },

        {
          Header: 'SOG',
          id: 'shots',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'S%',
          id: 'shotPct',
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 55,
        },
      ]}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
        },
      ]}
      defaultSortDesc
      className="-striped roster-stats"
      defaultPageSize="31"
    />
  </div>
);

HotTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default HotTable;
