/* global window */
import React from 'react';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

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
          accessor: d => `${d.info.fullName}+${d.id}`,
          className: 'text-left',
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
          Header: 'GP',
          id: 'games',
          accessor: d => d.stats[0].stat.games,
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'G',
          id: 'goals',
          accessor: d => d.stats[0].stat.goals,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'A',
          id: 'assists',
          accessor: d => d.stats[0].stat.assists,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: d => d.stats[0].stat.points,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          accessor: d => d.stats[0].stat.plusMinus,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'W',
          id: 'wins',
          accessor: d => d.stats[0].stat.wins,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'L',
          id: 'losses',
          accessor: d => d.stats[0].stat.losses,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'OT',
          id: 'ot',
          accessor: d => d.stats[0].stat.ot,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SV%',
          id: 'savePercentage',
          accessor: d => d.stats[0].stat.savePercentage,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 60,
        },
        {
          Header: 'GAA',
          id: 'goalAgainstAverage',
          accessor: d => d.stats[0].stat.goalAgainstAverage,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 60,
          sortMethod: (a, b) => (a > b ? -1 : 1),
        },
        {
          Header: 'SO',
          id: 'shutouts',
          accessor: d => d.stats[0].stat.shutouts,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SV',
          id: 'saves',
          accessor: d => d.stats[0].stat.saves,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GA',
          id: 'goalsAgainst',
          accessor: d => d.stats[0].stat.goalsAgainst,
          show: position === 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'pim',
          accessor: d => d.stats[0].stat.pim,
          show: position !== 'G',
          maxWidth: 55,
          minWidth: 50,
        },
        {
          Header: 'PPG',
          id: 'powerPlayGoals',
          accessor: d => d.stats[0].stat.powerPlayGoals,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SHG',
          id: 'shortHandedGoals',
          accessor: d => d.stats[0].stat.shortHandedGoals,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'GWG',
          id: 'gameWinningGoals',
          accessor: d => d.stats[0].stat.gameWinningGoals,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          accessor: d => d.stats[0].stat.hits,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Bks',
          id: 'blocked',
          accessor: d => d.stats[0].stat.blocked,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: d => d.stats[0].stat.shots,
          show: position !== 'G',
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'S%',
          id: 'shotPct',
          accessor: d => d.stats[0].stat.shotPct,
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
          accessor: d => d.stats[0].stat.timeOnIcePerGame,
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
      className="rosterStats"
      defaultPageSize={players.length}
    />
  </div>
);

export default RosterStatsTable;
