/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  insert, map, split, sum, pathOr,
} from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const sumByPath = (stats = [], props) => sum(map(pathOr(0, props), stats));
const useAcronyms = (leagueName) => {
  if (leagueName === 'National Hockey League') {
    return 'NHL';
  }
  return leagueName;
};

const CareerStatsTable = ({ stats, info }) => (
  <div>
    <ReactTable
      showPagination={false}
      resizable={false}
      sortable={false}
      data={stats}
      columns={[
        {
          Header: 'Season',
          id: 'fullName',
          className: 'text-left',
          accessor: d => insert(4, '-', split('', pathOr('-', ['season'], d))),
          maxWidth: 125,
          minWidth: 100,
          Footer: 'Total Stats',
        },
        {
          Header: 'League',
          id: 'league',
          maxWidth: 85,
          minWidth: 60,
          className: 'text-left',
          accessor: d => useAcronyms(pathOr('-', ['league', 'name'], d)),
        },
        {
          Header: 'Team',
          id: 'team',
          maxWidth: 250,
          minWidth: 200,
          className: 'border-right text-left team-cell',
          accessor: d => `${pathOr('-', ['team', 'name'], d)}+${pathOr('-', ['team', 'abbreviation'], d)}`,
          Cell: row => (
            <div>
              <img src={`/images/teams/small/${row.value.split('+')[1]}.png`} />
              {row.value.split('+')[0]}
            </div>
          ),
        },
        {
          Header: 'GP',
          id: 'games',
          maxWidth: 85,
          minWidth: 55,
          accessor: d => pathOr('-', ['stat', 'games'], d),
          Footer: sumByPath(stats, ['stat', 'games']),
        },
        {
          Header: 'G',
          id: 'goals',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'goals'], d),
          Footer: sumByPath(stats, ['stat', 'goals']),
        },
        {
          Header: 'A',
          id: 'assists',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'assists'], d),
          Footer: sumByPath(stats, ['stat', 'assists']),
        },
        {
          Header: 'Pts',
          id: 'points',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'points'], d),
          Footer: sumByPath(stats, ['stat', 'points']),
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'plusMinus'], d),
          Footer: sumByPath(stats, ['stat', 'plusMinus']),
        },
        {
          Header: 'PIM',
          id: 'pim',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'pim'], d),
          Footer: sumByPath(stats, ['stat', 'pim']),
        },
        {
          Header: 'Hits',
          id: 'hits',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'hits'], d),
          Footer: sumByPath(stats, ['stat', 'hits']),
        },
        {
          Header: 'Bks',
          id: 'blocked',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'blocked'], d),
          Footer: sumByPath(stats, ['stat', 'blocked']),
        },
        {
          Header: 'SOG',
          id: 'shots',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'shots'], d),
          Footer: sumByPath(stats, ['stat', 'shots']),
        },
        {
          Header: 'S%',
          id: 'shotPct',
          maxWidth: 85,
          minWidth: 60,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => `${pathOr('-', ['stat', 'shotPct'], d)}+${pathOr('-', ['stat', 'goals'], d)}+${pathOr('-', ['stat', 'shots'], d)}`,
          Cell: row => (
            <span>
              {row.value.split('+')[0]}
            </span>
          ),
          Footer: ((sumByPath(stats, ['stat', 'goals']) / sumByPath(stats, ['stat', 'shots'])) * 100).toFixed(1),
        },
        {
          Header: 'W',
          id: 'wins',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'wins'], d),
          Footer: sumByPath(stats, ['stat', 'wins']),
        },
        {
          Header: 'L',
          id: 'losses',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'losses'], d),
          Footer: sumByPath(stats, ['stat', 'losses']),
        },
        {
          Header: 'OT',
          id: 'ot',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'ot'], d),
          Footer: sumByPath(stats, ['stat', 'ot']),
        },
        {
          Header: 'SO',
          id: 'shutouts',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'shutouts'], d),
          Footer: sumByPath(stats, ['stat', 'shutouts']),
        },
        {
          Header: 'SV %',
          id: 'savePercentage',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => `${pathOr('-', ['stat', 'savePercentage'], d)}`,
          Cell: row => (
            <span>
              {row.value.split('+')[0].toFixed(3)}
            </span>
          ),
          Footer: (sumByPath(stats, ['stat', 'saves']) / (sumByPath(stats, ['stat', 'saves']) + sumByPath(stats, ['stat', 'goalsAgainst']))).toFixed(3),
        },
        {
          Header: 'GAA',
          id: 'goalAgainstAverage',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => `${pathOr('-', ['stat', 'goalAgainstAverage'], d)}`,
          Cell: row => (
            <span>
              {row.value.split('+')[0].toFixed(2)}
            </span>
          ),
          Footer: (sumByPath(stats, ['stat', 'goalsAgainst']) / sumByPath(stats, ['stat', 'games'])).toFixed(2),
        },
        {
          Header: 'SV',
          id: 'saves',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'saves'], d),
          Footer: sumByPath(stats, ['stat', 'saves']),
        },
      ]}
      defaultPageSize={stats.length}
      className="-striped career-stats"
    />
  </div>
);

CareerStatsTable.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  info: PropTypes.shape({}).isRequired,
};

export default CareerStatsTable;
