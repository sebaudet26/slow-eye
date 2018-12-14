/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

class PlayersTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTable
          data={players}
          noDataText="Loading all dat good data stuff..."
          columns={[
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => d.person.fullName,
              Cell: row => (
                <a href={`/player?id=${123}`}>{row.value}</a>
              ),
            },
            {
              Header: 'Goals',
              id: 'goals',
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'goals'], d),
              className: 'center',
            },
            {
              Header: 'Assists',
              id: 'assists',
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'assists'], d),
              className: 'center',
            },
            {
              Header: 'Points',
              id: 'points',
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'points'], d),
              className: 'center',
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default PlayersTable;
