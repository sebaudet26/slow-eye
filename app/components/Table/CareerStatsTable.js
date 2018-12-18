/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

class CareerStatsTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactTable
          showPagination={false}
          sortable={false}
          columns={[
            {
              Header: 'Season',
              id: 'fullName',
              className: 'text-left',
              accessor: 'test',
              maxWidth: 200,
              minWidth: 125,
              Footer: 'Total Stats',
            },
            {
              Header: 'Team',
              id: 'team',
              className: 'border-right text-left',
              accessor: 'test',
            },
            {
              Header: 'GP',
              id: 'games',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'G',
              id: 'goals',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'A',
              id: 'assists',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'PIM',
              id: 'pim',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'Hits',
              id: 'hits',
              maxWidth: 85,
              minWidth: 50,
              accessor: 'test',
            },
            {
              Header: 'Bks',
              id: 'blocked',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'blocked'], d),
            },
            {
              Header: 'SOG',
              id: 'shots',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shots'], d),
            },
            {
              Header: 'S%',
              id: 'shotPct',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shotPct'], d),
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight career-stats"
        />
      </div>
    );
  }
}

CareerStatsTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CareerStatsTable;
