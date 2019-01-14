/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  find, propEq, pathOr, isEmpty,
} from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';


class RosterTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTable
          data={players}
          resizable={false}
          noDataText="Loading all dat good data stuff..."
          columns={[
            {
              Header: '#',
              id: 'primaryNumber',
              accessor: d => Number(d.player.info.primaryNumber),
              className: 'text-left',
              maxWidth: 40,
              minWidth: 40,
            },
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => `${d.player.info.fullName}+${d.player.id}`,
              className: 'text-left',
              maxWidth: 200,
              minWidth: 150,
              Cell: row => (
                <a href={`./player?id=${row.value.split('+')[1]}`}>
                  {row.value.split('+')[0]}
                </a>
              ),
            },
            {
              Header: 'Shoots',
              id: 'shootsCatches',
              className: 'text-left',
              maxWidth: 75,
              minWidth: 50,
              accessor: d => d.player.info.shootsCatches,
            },
            {
              Header: 'Age',
              id: 'age',
              className: 'text-left',
              maxWidth: 65,
              minWidth: 50,
              accessor: d => d.player.info.currentAge,
            },
            {
              Header: 'Birthday',
              id: 'birthDate',
              className: 'text-left',
              maxWidth: 130,
              minWidth: 50,
              accessor: d => d.player.info.birthDate,
            },
            {
              Header: 'Height',
              id: 'height',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.player.info.height,
            },
            {
              Header: 'Weight',
              id: 'weight',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.player.info.weight,
            },
            {
              Header: 'Birthplace',
              id: 'birthCity',
              className: 'text-left team-cell',
              maxWidth: 175,
              minWidth: 75,
              accessor: d => `${[d.player.info.birthCity, d.player.info.birthStateProvince || ''].filter(Boolean).join(', ')} `,
            },
            {
              Header: 'Country',
              id: 'nationality',
              className: 'text-left team-cell',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.player.info.nationality,
              Cell: row => (
                <img src={`/images/country/${row.value}.svg`} />
              ),
            },
            {
              Header: 'Draft',
              id: 'draftInfo',
              className: 'text-left team-cell',
              maxWidth: 185,
              minWidth: 150,
              accessor: d => `${d.player.info.draftInfo.year || ''}+${pathOr('Undrafted', ['player', 'info', 'draftInfo', 'team', 'abbreviation'], d)}+${d.player.info.draftInfo.pickOverall || ''}`,
              Cell: row => (
                <span>
                  {row.value.split('+')[0]}
                  {' '}
                  {row.value.split('+')[1]}
                </span>
              ),
            },
          ]}
          defaultSorted={[
            {
              id: 'primaryNumber',
              desc: false,
            },
          ]}
          defaultSortAsc
          showPagination={false}
          className="-striped roster"
          defaultPageSize={players.length}
        />
      </div>
    );
  }
}

export default RosterTable;
