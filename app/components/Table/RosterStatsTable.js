/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  find, propEq, pathOr, isEmpty,
} from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';


class RosterStatsTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
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
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.games,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'G',
              id: 'goals',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.goals,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'A',
              id: 'assists',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.assists,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.points,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.plusMinus,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'PIM',
              id: 'pim',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.pim,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'PPG',
              id: 'powerPlayGoals',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.powerPlayGoals,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'SHG',
              id: 'shortHandedGoals',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.shortHandedGoals,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'GWG',
              id: 'gameWinningGoals',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.gameWinningGoals,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'Hits',
              id: 'hits',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.hits,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'Bks',
              id: 'blocked',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.blocked,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'SOG',
              id: 'shots',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.shots,
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'S%',
              id: 'shotPct',
              accessor: d => d.player.stats[d.player.stats.length - 1].stat.shotPct,
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
  }
}

export default RosterStatsTable;
