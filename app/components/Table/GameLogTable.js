/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr, not } from 'ramda';
import { sortTimeOnIce } from '../../utils/sort';
import 'react-table/react-table.css';
import './styles.scss';

const isGoalie = pos => pos === 'G';

class GameLogTable extends React.PureComponent {
  render() {
    const { logs, info } = this.props;
    console.log('logs', logs);
    let data = [];
    if (logs.length) {
      data = logs;
    }
    const pos = info.primaryPosition.abbreviation;
    return (
      <div>
        <ReactTable
          resizable={false}
          data={logs}
          noDataText="Loading all dat good data stuff..."
          defaultPageSize={10}
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
              show: not(isGoalie(pos)),
              accessor: d => d.stat.goals,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'A',
              id: 'assists',
              show: not(isGoalie(pos)),
              accessor: d => d.stat.assists,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              show: not(isGoalie(pos)),
              accessor: d => d.stat.points,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              show: not(isGoalie(pos)),
              accessor: d => d.stat.plusMinus,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'W',
              id: 'wins',
              show: isGoalie(pos),
              accessor: d => (d.isWin ? 1 : 0),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'L',
              id: 'losses',
              show: isGoalie(pos),
              accessor: d => (d.isWin || d.isOT ? '0' : '1'),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'OT',
              id: 'ot',
              show: isGoalie(pos),
              accessor: d => (d.isOT ? '1' : '0'),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SV%',
              id: 'savePercentage',
              show: isGoalie(pos),
              accessor: d => d.stat.savePercentage.toFixed(3),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GA',
              id: 'goalsAgainst',
              show: isGoalie(pos),
              accessor: d => d.stat.goalsAgainst,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SA',
              id: 'saves',
              show: isGoalie(pos),
              accessor: d => d.stat.saves,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SO',
              id: 'shutouts',
              show: isGoalie(pos),
              accessor: d => d.stat.shutouts,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Hits',
              id: 'hits',
              accessor: d => d.stat.hits,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Bks',
              id: 'blocked',
              accessor: d => d.stat.blocked,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'PPG',
              id: 'powerPlayGoals',
              accessor: d => d.stat.powerPlayGoals,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SHG',
              id: 'shortHandedGoals',
              accessor: d => d.stat.shortHandedGoals,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GWG',
              id: 'gameWinningGoals',
              accessor: d => d.stat.gameWinningGoals,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'SOG',
              id: 'shots',
              accessor: d => d.stat.shots,
              show: not(isGoalie(pos)),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'Shifts',
              id: 'shifts',
              show: not(isGoalie(pos)),
              accessor: d => d.stat.shifts,
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'TOI',
              id: 'toi',
              accessor: d => d.stat.timeOnIce,
              maxWidth: 65,
              minWidth: 60,
              sortMethod: sortTimeOnIce,
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
