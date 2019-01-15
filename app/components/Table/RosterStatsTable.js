/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import {
  last, pipe, pathOr,
} from 'ramda';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

const takeLatestSeason = pipe(pathOr([], ['player', 'stats']), last);

const RosterStatsTable = ({ players }) => (
  <div>
    <ReactTable
      data={players}
      resizable={false}
      noDataText="Loading all dat good data stuff..."
      columns={[
        {
          Header: '#',
          id: 'rank',
          Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
          className: 'text-left',
          sortable: false,
          maxWidth: 40,
          minWidth: 40,
        },
        {
          Header: 'Name',
          id: 'fullName',
          accessor: d => `${d.player.info.fullName}+${d.player.id}`,
          className: 'text-left',
          maxWidth: 200,
          minWidth: 150,
          Cell: row => (
            <a href={`./player?id=${row.value.split('+')[1]}`}>
              {row.value.split('+')[0]}
            </a>
          ),
        },
        {
          Header: 'Age',
          id: 'age',
          className: 'text-left border-right',
          maxWidth: 65,
          minWidth: 50,
          accessor: d => d.player.info.currentAge,
        },
        {
          Header: 'GP',
          id: 'games',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'games'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'G',
          id: 'goals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'goals'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'A',
          id: 'assists',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'assists'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'points'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'plusMinus'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'pim',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'pim'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PPG',
          id: 'powerPlayGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'powerPlayGoals'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SHG',
          id: 'shortHandedGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shortHandedGoals'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GWG',
          id: 'gameWinningGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'gameWinningGoals'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'hits'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Bks',
          id: 'blocked',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'blocked'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shots'])),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'S%',
          id: 'shotPct',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shotPct'])),
          maxWidth: 75,
          minWidth: 50,
        },
      ]}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
        },
      ]}
      defaultSortDesc
      showPagination={false}
      className="-striped rosterStats"
      defaultPageSize={players.length}
    />
  </div>
);

RosterStatsTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default RosterStatsTable;
