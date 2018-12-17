/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

class CareerStatsTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTable
          columns={[
            {
              Header: 'Season',
              id: 'fullName',
              accessor: 'test',
              className: 'first-col',
              Cell: row => (
                <a href={`/player?id=${123}`}>{row.value}</a>
              ),
            },
            {
              Header: 'GP',
              id: 'games',
              accessor: 'test',
            },
            {
              Header: 'G',
              id: 'goals',
              accessor: 'test',
            },
            {
              Header: 'A',
              id: 'assists',
              accessor: 'test',
            },
            {
              Header: 'Pts',
              id: 'points',
              accessor: 'test',
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              accessor: 'test',
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

CareerStatsTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CareerStatsTable;
