/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class RosterTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTableFixedColumns
          data={players}
          resizable={false}
          noDataText="Loading all that good stuff..."
          columns={[
            {
              Header: '#',
              id: 'primaryNumber',
              accessor: d => Number(d.info.primaryNumber),
              className: 'text-left',
              maxWidth: 40,
              minWidth: 40,
            },
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => `${d.info.fullName}+${d.id}`,
              className: 'text-left',
              maxWidth: 200,
              minWidth: 150,
              Cell: row => (
                <a href={`/player?id=${row.value.split('+')[1]}`}>
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
              accessor: d => d.info.shootsCatches,
            },
            {
              Header: 'Age',
              id: 'age',
              className: 'text-left',
              maxWidth: 65,
              minWidth: 50,
              accessor: d => d.info.currentAge,
            },
            {
              Header: 'Birthday',
              id: 'birthDate',
              className: 'text-left',
              maxWidth: 130,
              minWidth: 110,
              accessor: d => d.info.birthDate,
            },
            {
              Header: 'Height',
              id: 'height',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 55,
              accessor: d => d.info.height,
            },
            {
              Header: 'Weight',
              id: 'weight',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.info.weight,
            },
            {
              Header: 'Birthplace',
              id: 'birthCity',
              className: 'text-left team-cell',
              maxWidth: 175,
              minWidth: 90,
              accessor: d => `${[d.info.birthCity, d.info.birthStateProvince || ''].filter(Boolean).join(', ')} `,
            },
            {
              Header: 'Country',
              id: 'nationality',
              className: 'text-left team-cell',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.info.nationality,
              Cell: row => (
                <img src={`/images/country/${row.value}.svg`} alt="" />
              ),
            },
            {
              Header: 'Draft',
              id: 'draftInfo',
              className: 'text-left team-cell',
              maxWidth: 185,
              minWidth: 150,
              accessor: d => d.info.draftInfo,
              Cell: row => (!row.value ? 'Undrafted' : (
                <div className="draft">
                  {`${row.value.year} - ${row.value.team.abbreviation} - #${row.value.pickOverall} Overall`}
                </div>
              )),
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
          className="roster"
          defaultPageSize={players.length}
        />
      </div>
    );
  }
}

export default RosterTable;
