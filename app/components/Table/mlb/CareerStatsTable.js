import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  filter,
  insert,
  map,
  mean,
  reject,
  isNil,
  pathOr,
  reverse,
  pipe,
  prop,
  split,
  sum,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import { sumNumbers } from '../../../utils/player';
import 'react-table/react-table.css';
import '../styles.scss';

const sumByPath = (data = [], props) => sum(map(pathOr(0, props), data));

const ReactTableFixedColumns = withFixedColumns(ReactTable);
class CareerStatsTable extends React.PureComponent {
  render() {
    const stats = this.props.stats;
    console.log(stats);
    return (
      <ReactTableFixedColumns
        showPagination={false}
        sortable={false}
        resizable={false}
        data={stats}
        columns={[
          {
            Header: 'Season',
            id: 'fullName',
            className: 'text-left',
            accessor: d => d.season,
            maxWidth: 115,
            minWidth: 115,
            Footer: 'Total Stats',
          },
          {
            Header: 'League',
            id: 'league',
            maxWidth: 100,
            minWidth: 75,
            className: 'text-left',
            accessor: prop('team'),
            Cell: row => (
              <div>
                {row.value.league.orgCode}
              </div>
            ),
          },
          {
            Header: 'Team',
            id: 'team',
            maxWidth: 250,
            minWidth: 225,
            className: 'border-right text-left team-cell',
            accessor: prop('team'),
            Cell: row => (
              <div>
                <img className="team-cell-logo" src={`https://www.mlbstatic.com/team-logos/${row.value.id}.svg`} />
                {row.value.name}
              </div>
            ),
          },
          {
            Header: 'GP',
            id: 'games',
            maxWidth: 85,
            minWidth: 65,
            accessor: d => pathOr('-', ['stat', 'gamesPlayed'], d),
            Footer: sumNumbers(stats, ['stat', 'gamesPlayed']),
          },
          {
            Header: 'AB',
            id: 'atBats',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'atBats'], d),
            Footer: sumNumbers(stats, ['stat', 'atBats']),
          },
          {
            Header: 'H',
            id: 'hits',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'hits'], d),
            Footer: sumNumbers(stats, ['stat', 'hits']),
          },
          {
            Header: 'AVG',
            id: 'avg',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'avg'], d),
            Footer: (sumByPath(stats, ['stat', 'hits']) / (sumByPath(stats, ['stat', 'atBats']))).toFixed(3).replace(/^0+/, ''),
          },
          {
            Header: 'HR',
            id: 'hr',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'homeRuns'], d),
            Footer: sumNumbers(stats, ['stat', 'homeRuns']),
          },
          {
            Header: 'RBI',
            id: 'rbi',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'rbi'], d),
            Footer: sumNumbers(stats, ['stat', 'rbi']),
          },
          {
            Header: 'R',
            id: 'runs',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'runs'], d),
            Footer: sumNumbers(stats, ['stat', 'runs']),
          },
          {
            Header: 'BB',
            id: 'bb',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'baseOnBalls'], d),
            Footer: sumNumbers(stats, ['stat', 'baseOnBalls']),
          },
          {
            Header: 'SO',
            id: 'so',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'strikeOuts'], d),
            Footer: sumNumbers(stats, ['stat', 'strikeOuts']),
          },
          {
            Header: 'SB',
            id: 'sb',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'stolenBases'], d),
            Footer: sumNumbers(stats, ['stat', 'stolenBases']),
          },
          {
            Header: 'CS',
            id: 'cs',
            maxWidth: 85,
            minWidth: 55,
            accessor: d => pathOr('-', ['stat', 'caughtStealing'], d),
            Footer: sumNumbers(stats, ['stat', 'caughtStealing']),
          },
        ]}
        className="career-stats"
        defaultPageSize={stats.length}
      />
    );
  }
}


export default CareerStatsTable;
