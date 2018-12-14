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
              className: 'first-col',
              Cell: row => (
                <a href={`/player?id=${123}`}>{row.value}</a>
              ),
            },
            {
              Header: 'GP',
              id: 'games',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'games'], d),
            },
            {
              Header: 'Goals',
              id: 'goals',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'goals'], d),
            },
            {
              Header: 'Assists',
              id: 'assists',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'assists'], d),
            },
            {
              Header: 'Points',
              id: 'points',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'points'], d),
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'plusMinus'], d),
            },
            {
              Header: 'PIM',
              id: 'penaltyMinutes',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'penaltyMinutes'], d),
            },
            {
              Header: 'Hits',
              id: 'hits',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'hits'], d),
            },
            {
              Header: 'Bks',
              id: 'blocked',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'blocked'], d),
            },
            {
              Header: 'SOG',
              id: 'shots',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shots'], d),
            },
            {
              Header: 'S%',
              id: 'shotPct',
              maxWidth: 90,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shotPct'], d),
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={20}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default PlayersTable;
