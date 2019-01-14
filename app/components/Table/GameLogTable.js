/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  find, propEq, pathOr, isEmpty,
} from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

class GameLogTable extends React.PureComponent {
  render() {
    const { logs } = this.props;
    console.log('logs', logs);
    let data = [];
    if (logs.length) {
      data = logs;
    }
    return (
      <div>
        <ReactTable
          resizable={false}
          data={logs}
          noDataText="Loading all dat good data stuff..."
          defaultPageSize={20}
          getTdProps={(state, rowInfo, column, instance) => ({
            onClick: (e, handleOriginal) => {
              console.log('It was in this row:', rowInfo);
              if (handleOriginal) {
                handleOriginal();
              }
            },
          })}
          columns={[
            {
              Header: 'Date',
              id: 'date',
              className: 'text-left',
              accessor: d => d.date,
              maxWidth: 125,
              minWidth: 100,
            },
            {
              Header: 'VS',
              id: 'vs',
              className: 'text-left team-cell',
              accessor: d => pathOr(['logs'], ['opponent'], d),
              maxWidth: 250,
              minWidth: 200,
              sortable: false,
              Cell: row => (
                <a href={`./team?id=${row.value.id}`}>
                  <img src={`/images/teams/small/${row.value.abbreviation}.png`} />
                  {row.value.shortName}
                  {' '}
                  {row.value.teamName}
                </a>
              ),
            },
            {
              Header: 'G',
              id: 'goals',
              accessor: d => d.stat.goals,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'A',
              id: 'assists',
              accessor: d => d.stat.assists,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              accessor: d => d.stat.points,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              accessor: d => d.stat.plusMinus,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'PIM',
              id: 'pim',
              accessor: d => d.stat.pim,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Hits',
              id: 'hits',
              accessor: d => d.stat.hits,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Bks',
              id: 'blocked',
              accessor: d => d.stat.blocked,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'PPG',
              id: 'powerPlayGoals',
              accessor: d => d.stat.powerPlayGoals,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SHG',
              id: 'shortHandedGoals',
              accessor: d => d.stat.shortHandedGoals,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GWG',
              id: 'gameWinningGoals',
              accessor: d => d.stat.gameWinningGoals,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SOG',
              id: 'shots',
              accessor: d => d.stat.shots,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'TOI',
              id: 'toi',
              accessor: d => d.stat.timeOnIce,
              maxWidth: 65,
              minWidth: 60,
            },
            {
              Header: 'Shifts',
              id: 'shifts',
              accessor: d => d.stat.shifts,
              maxWidth: 65,
              minWidth: 50,
            },
          ]}
          defaultSortDesc
          showPagination
          className="-striped gameLog-table"
        />
      </div>
    );
  }
}

GameLogTable.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default GameLogTable;
