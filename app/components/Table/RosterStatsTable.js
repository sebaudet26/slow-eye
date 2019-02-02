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
const takeLatestSeason = pipe(pathOr([], ['player', 'stats']), last);

const RosterStatsTable = ({ players, position }) => (
  <div>
    <ReactTableFixedColumns
      data={players}
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
          accessor: d => `${d.player.info.fullName}+${d.player.id}`,
          className: 'text-left border-mobile',
          fixed: 'left',
          maxWidth: 200,
          minWidth: 150,
          Cell: row => (
            <a href={`/player?id=${row.value.split('+')[1]}`}>
              {row.value.split('+')[0]}
            </a>
          ),
        },
        {
          Header: 'Age',
          id: 'age',
          className: 'border-right hidden-mobile',
          maxWidth: 65,
          minWidth: 50,
          fixed: 'left',
          accessor: d => d.player.info.currentAge,
        },
        {
          Header: 'GP',
          id: 'games',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'games'])),
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'G',
          id: 'goals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'goals'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'A',
          id: 'assists',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'assists'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'points'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'plusMinus'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'W',
          id: 'wins',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'wins'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'L',
          id: 'losses',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'losses'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'OT',
          id: 'ot',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'ot'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SV%',
          id: 'savePercentage',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'savePercentage']), invoker(1, 'toFixed')(3)),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GAA',
          id: 'goalAgainstAverage',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'goalAgainstAverage'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
          sortMethod: (a, b) => (a > b ? -1 : 1),
        },
        {
          Header: 'SO',
          id: 'shutouts',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shutouts'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SV',
          id: 'saves',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'saves'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GA',
          id: 'goalsAgainst',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'goalsAgainst'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'pim',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'pim'])),
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PPG',
          id: 'powerPlayGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'powerPlayGoals'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SHG',
          id: 'shortHandedGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shortHandedGoals'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GWG',
          id: 'gameWinningGoals',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'gameWinningGoals'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'hits'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Bks',
          id: 'blocked',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'blocked'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'shots'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'S%',
          id: 'shotPct',
          accessor: d => pipe(takeLatestSeason, pathOr('0', ['stat', 'shotPct']))(d),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 55,
          Cell: row => (
            <span>{Number(row.value).toFixed(1)}</span>
          ),
        },
        {
          Header: 'TOI/GP',
          id: 'timeOnIcePerGame',
          accessor: pipe(takeLatestSeason, pathOr(0, ['stat', 'timeOnIcePerGame'])),
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 65,
        },
      ]}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
        },
        {
          id: 'wins',
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
