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
              accessor: d => Number(d.bio.jerseyNumber),
              className: 'text-left',
              maxWidth: 40,
              minWidth: 40,
            },
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => `${d.bio.firstName} ${d.bio.lastName}`,
              className: 'text-left',
              maxWidth: 200,
              minWidth: 150,
              Cell: row => (
                <a href={`/player?id=${row.original.id}`}>
                  {row.value}
                </a>
              ),
            },
            {
              Header: 'Shoots',
              id: 'shootsCatches',
              className: 'text-left',
              maxWidth: 75,
              minWidth: 50,
              accessor: d => d.bio.shootsCatches,
            },
            {
              Header: 'Age',
              id: 'age',
              className: 'text-left',
              maxWidth: 65,
              minWidth: 50,
              accessor: d => d.bio.age,
            },
            {
              Header: 'Birthday',
              id: 'birthDate',
              className: 'text-left',
              maxWidth: 130,
              minWidth: 110,
              accessor: d => d.bio.birthDate,
            },
            {
              Header: 'Height',
              id: 'height',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 55,
              accessor: d => `${d.bio.height.feet}' ${d.bio.height.inches}`,
            },
            {
              Header: 'Weight',
              id: 'weight',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => `${d.bio.weight.pounds} lbs`,
            },
            {
              Header: 'Birthplace',
              id: 'birthCity',
              className: 'text-left team-cell',
              maxWidth: 175,
              minWidth: 90,
              accessor: d => `${d.bio.birthCity}${d.bio.birthState ? ', ' + d.bio.birthState : ''}`,
            },
            {
              Header: 'Country',
              id: 'nationality',
              className: 'text-left team-cell',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => d.bio.birthCountry,
              Cell: row => (
                <img src={`/public/images/country/${row.value}.svg`} alt="" />
              ),
            },
            {
              Header: 'Draft',
              id: 'draftInfo',
              className: 'text-left team-cell',
              maxWidth: 185,
              minWidth: 150,
              accessor: d => d.draft,
              Cell: row => (!row.value.overall ? 'Undrafted' : (
                <div className="draft">
                  {`${row.value.year} - ${row.value.pickHistory.reverse()[0]} - ${row.value.overall} Overall`}
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
