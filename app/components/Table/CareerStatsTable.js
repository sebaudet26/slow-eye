/* global window */

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
  pipe,
  prop,
  split,
  sum,
} from 'ramda';
import { sumNumbers } from '../../utils/player';
import 'react-table/react-table.css';
import './styles.scss';

const sumByPath = (data = [], props) => sum(map(pathOr(0, props), data));
const calculateAverage = ({
  data, pathToNumber, pathToDividend, percentage,
}) => {
  const isNumber = v => typeof v === 'number';
  const total = sumByPath(filter(isNumber, data), pathToNumber);
  const dividend = sumByPath(filter(isNumber, data), pathToDividend);
  if (!dividend || typeof total !== 'number' || typeof dividend !== 'number') {
    return '-';
  }
  return (percentage ? total / dividend * 100 : total / dividend).toFixed(1);
};
const useAcronyms = (leagueName) => {
  if (leagueName === 'National Hockey League') {
    return 'NHL';
  }
  return leagueName;
};

const CareerStatsTable = ({ stats, info, showTotalRow }) => (
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
          maxWidth: 115,
          minWidth: 115,
          Footer: showTotalRow && 'Total Stats',
        },
        {
          Header: 'League',
          id: 'league',
          maxWidth: 100,
          minWidth: 75,
          className: 'text-left',
          accessor: d => useAcronyms(pathOr('-', ['league', 'name'], d)),
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
              {
                  row.value.id ? (
                    <svg className="team-cell-logo">
                      <use xlinkHref={`/public/images/teams/season/${row.original.season}.svg#team-${row.value.id}-${row.original.season}-light`} />
                    </svg>
                  ) : null
                }
              {row.value.name}
            </div>
          ),
        },
        {
          Header: 'GP',
          id: 'games',
          maxWidth: 85,
          minWidth: 65,
          accessor: d => pathOr('-', ['stat', 'games'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'games']),
        },
        {
          Header: 'G',
          id: 'goals',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'goals'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'goals']),
        },
        {
          Header: 'A',
          id: 'assists',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'assists'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'assists']),
        },
        {
          Header: 'Pts',
          id: 'points',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'points'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'points']),
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'plusMinus'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'plusMinus']),
        },
        {
          Header: 'PIM',
          id: 'pim',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'pim'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'pim']),
        },
        {
          Header: 'Hits',
          id: 'hits',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'hits'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'hits']),
        },
        {
          Header: 'Bks',
          id: 'blocked',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'blocked'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'blocked']),
        },
        {
          Header: 'SOG',
          id: 'shots',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'shots'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'shots']),
        },
        {
          Header: 'S%',
          id: 'shotPct',
          maxWidth: 85,
          minWidth: 60,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: pathOr('-', ['stat', 'shotPct']),
          Cell: row => (
            <span>{typeof row.value === 'number' ? Number(row.value).toFixed(1) : '-'}</span>
          ),
          Footer: showTotalRow && pipe(
            map(pathOr(null, ['stat', 'shotPct'])),
            reject(isNil),
            map(Number),
            mean,
            d => (d == 0 ? '-' : d.toFixed(1)),
          )(stats),
        },
        {
          Header: 'W',
          id: 'wins',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'wins'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'wins']),
        },
        {
          Header: 'L',
          id: 'losses',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'losses'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'losses']),
        },
        {
          Header: 'OT',
          id: 'ot',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'ot'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'ot']),
        },
        {
          Header: 'SO',
          id: 'shutouts',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'shutouts'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'shutouts']),
        },
        {
          Header: 'SV %',
          id: 'savePercentage',
          maxWidth: 85,
          minWidth: 70,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: pathOr('-', ['stat', 'savePercentage']),
          Cell: row => (
            <span>{typeof row.value === 'number' ? Number(row.value).toFixed(3) : '-'}</span>
          ),
          Footer: showTotalRow && (sumByPath(stats, ['stat', 'saves']) / (sumByPath(stats, ['stat', 'saves']) + sumByPath(stats, ['stat', 'goalsAgainst']))).toFixed(3),
        },
        {
          Header: 'GAA',
          id: 'goalAgainstAverage',
          maxWidth: 85,
          minWidth: 60,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: pathOr('-', ['stat', 'goalAgainstAverage']),
          Cell: row => (
            <span>{typeof row.value === 'number' ? Number(row.value).toFixed(2) : '-'}</span>
          ),
          Footer: showTotalRow && (sumByPath(stats, ['stat', 'goalsAgainst']) / sumByPath(stats, ['stat', 'games'])).toFixed(2),
          sortMethod: (a, b) => (a > b ? -1 : 1),
        },
        {
          Header: 'SV',
          id: 'saves',
          maxWidth: 85,
          minWidth: 70,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'saves'], d),
          Footer: showTotalRow && sumNumbers(stats, ['stat', 'saves']),
        },
      ]}
      defaultPageSize={stats.length}
      className="career-stats"
    />
  </div>
);

CareerStatsTable.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  info: PropTypes.shape({}).isRequired,
};

export default CareerStatsTable;
