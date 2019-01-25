/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

class DraftTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactTable
          resizable={false}
          noDataText="Loading all dat good data stuff..."
          columns={[
            {
              Header: 'Rd.',
              id: 'roundNumber',
              className: 'text-left',
              maxWidth: 40,
              minWidth: 40,
            },
            {
              Header: 'Pick',
              id: 'overallPcikNumber',
              className: 'text-left',
              maxWidth: 50,
              minWidth: 50,
            },
            {
              Header: 'Team',
              id: 'fullName',
              className: 'text-left team-cell',
              maxWidth: 150,
              minWidth: 100,
            },
            {
              Header: 'Name',
              id: 'fullName',
              className: 'text-left',
              maxWidth: 200,
              minWidth: 150,
            },
            {
              Header: 'Pos.',
              id: 'position',
              className: 'text-left',
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'Nat.',
              id: 'countryCode',
              className: 'text-left',
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'League',
              id: 'amateurLeague',
              className: 'text-left',
              maxWidth: 100,
              minWidth: 100,
            },
            {
              Header: 'Am. Team',
              id: 'amateurClubName',
              className: 'text-left',
              maxWidth: 100,
              minWidth: 100,
            },
            {
              Header: 'GP',
              id: 'games',
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'G',
              id: 'goals',
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'A',
              id: 'assists',
              maxWidth: 75,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 75,
              minWidth: 50,
            },
          ]}
          defaultSortAsc
          showPagination={false}
          className="-striped"
          defaultPageSize={31}
        />
      </div>
    );
  }
}

export default DraftTable;
