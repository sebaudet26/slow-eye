/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const CareerStatsTable = ({ stats }) => (
  <div>
    <ReactTable
      showPagination={false}
      sortable={false}
      data={stats}
      columns={[
        {
          Header: 'Season',
          id: 'fullName',
          className: 'text-left',
          accessor: d => pathOr('-', ['season'], d),
          maxWidth: 200,
          minWidth: 125,
          Footer: 'Total Stats',
        },
        {
          Header: 'League',
          id: 'league',
          maxWidth: 250,
          minWidth: 225,
          className: 'border-right text-left',
          accessor: d => pathOr('-', ['league', 'name'], d),
        },
        {
          Header: 'Team',
          id: 'team',
          maxWidth: 200,
          minWidth: 200,
          className: 'border-right text-left',
          accessor: d => pathOr('-', ['team', 'name'], d),
        },
        {
          Header: 'GP',
          id: 'games',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'games'], d),
        },
        {
          Header: 'G',
          id: 'goals',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'goals'], d),
        },
        {
          Header: 'A',
          id: 'assists',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'assists'], d),
        },
        {
          Header: 'Pts',
          id: 'points',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'points'], d),
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'plusMinus'], d),
        },
        {
          Header: 'PIM',
          id: 'pim',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'pim'], d),
        },
        {
          Header: 'Hits',
          id: 'hits',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'hits'], d),
        },
        {
          Header: 'Bks',
          id: 'blocked',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'blocked'], d),
        },
        {
          Header: 'SOG',
          id: 'shots',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'shots'], d),
        },
        {
          Header: 'S%',
          id: 'shotPct',
          maxWidth: 85,
          minWidth: 50,
          accessor: d => pathOr('-', ['stat', 'shotPct'], d),
        },
      ]}
      defaultPageSize={stats.length}
      className="-striped -highlight career-stats"
    />
  </div>
);

CareerStatsTable.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CareerStatsTable;
