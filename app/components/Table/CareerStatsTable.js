/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  insert, map, split, sum, pathOr, filter,
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
          minWidth: 110,
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
          minWidth: 225,
          className: 'border-right text-left team-cell',
          // accessor: d => d.team,
          accessor: d => `${d.team.name}+${d.team.id}+${d.season}`,
          Cell: row => (
            <div>
              <svg className="team-cell-logo">
                <use xlinkHref={`/images/teams/season/${row.value.split('+')[2]}.svg#team-${row.value.split('+')[1]}-${row.value.split('+')[2]}-light`} />
              </svg>
              {row.value.split('+')[0]}
            </div>
          ),
        },
        {
          Header: 'GP',
          id: 'games',
          maxWidth: 85,
          minWidth: 65,
          accessor: d => pathOr('-', ['stat', 'games'], d),
          Footer: sumNumbers(stats, ['stat', 'games']),
        },
        {
          Header: 'G',
          id: 'goals',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'goals'], d),
          Footer: sumNumbers(stats, ['stat', 'goals']),
        },
        {
          Header: 'A',
          id: 'assists',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'assists'], d),
          Footer: sumNumbers(stats, ['stat', 'assists']),
        },
        {
          Header: 'Pts',
          id: 'points',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'points'], d),
          Footer: sumNumbers(stats, ['stat', 'points']),
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'plusMinus'], d),
          Footer: sumNumbers(stats, ['stat', 'plusMinus']),
        },
        {
          Header: 'PIM',
          id: 'pim',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'pim'], d),
          Footer: sumNumbers(stats, ['stat', 'pim']),
        },
        {
          Header: 'Hits',
          id: 'hits',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'hits'], d),
          Footer: sumNumbers(stats, ['stat', 'hits']),
        },
        {
          Header: 'Bks',
          id: 'blocked',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'blocked'], d),
          Footer: sumNumbers(stats, ['stat', 'blocked']),
        },
        {
          Header: 'SOG',
          id: 'shots',
          maxWidth: 85,
          minWidth: 65,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: d => pathOr('-', ['stat', 'shots'], d),
          Footer: sumNumbers(stats, ['stat', 'shots']),
        },
        {
          Header: 'S%',
          id: 'shotPct',
          maxWidth: 85,
          minWidth: 60,
          show: info.primaryPosition.name !== 'Goalie',
          accessor: sumNumbers('-', ['stat', 'shotPct']),
          Cell: row => (
            <span>{typeof row.value === 'number' ? Number(row.value).toFixed(1) : '-'}</span>
          ),
          Footer: (
            calculateAverage({
              data: stats,
              pathToNumber: ['stat', 'goals'],
              pathToDividend: ['stat', 'shots'],
              percentage: true,
            })
          ),
        },
        {
          Header: 'W',
          id: 'wins',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'wins'], d),
          Footer: sumNumbers(stats, ['stat', 'wins']),
        },
        {
          Header: 'L',
          id: 'losses',
          maxWidth: 85,
          minWidth: 55,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'losses'], d),
          Footer: sumNumbers(stats, ['stat', 'losses']),
        },
        {
          Header: 'OT',
          id: 'ot',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'ot'], d),
          Footer: sumNumbers(stats, ['stat', 'ot']),
        },
        {
          Header: 'SO',
          id: 'shutouts',
          maxWidth: 85,
          minWidth: 50,
          show: info.primaryPosition.name === 'Goalie',
          filterable: false,
          accessor: d => pathOr('-', ['stat', 'shutouts'], d),
          Footer: sumNumbers(stats, ['stat', 'shutouts']),
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
          Footer: (sumByPath(stats, ['stat', 'saves']) / (sumByPath(stats, ['stat', 'saves']) + sumByPath(stats, ['stat', 'goalsAgainst']))).toFixed(3),
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
          Footer: (sumByPath(stats, ['stat', 'goalsAgainst']) / sumByPath(stats, ['stat', 'games'])).toFixed(2),
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
          Footer: sumNumbers(stats, ['stat', 'saves']),
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
