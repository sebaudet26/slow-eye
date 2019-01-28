/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { prop } from 'ramda';
import PlayerName from '../PlayerName';
import 'react-table/react-table.css';
import './styles.scss';

const DraftTable = ({ draft, round }) => (
  <ReactTable
    data={draft}
    resizable={false}
    noDataText="Loading all dat good data stuff..."
    columns={[
      {
        Header: 'Rd.',
        id: 'roundNumber',
        className: 'text-left',
        accessor: prop('round'),
        maxWidth: 40,
        minWidth: 40,
      },
      {
        Header: 'Pick',
        id: 'overallPcikNumber',
        className: 'text-left',
        accessor: prop('overallNumber'),
        maxWidth: 50,
        minWidth: 50,
      },
      {
        Header: 'Team',
        id: 'team',
        accessor: prop('teamPickHistory'),
        className: 'text-left team-cell',
        maxWidth: 150,
        minWidth: 100,
      },
      {
        Header: 'Name',
        id: 'fullName',
        accessor: prop('name'),
        className: 'text-left',
        maxWidth: 200,
        minWidth: 150,
        Cell: row => <PlayerName id={row.original.id} name={row.value} />,
      },
      {
        Header: 'Pos.',
        id: 'position',
        accessor: prop('position'),
        className: 'text-left',
        maxWidth: 75,
        minWidth: 50,
      },
      {
        Header: 'Nat.',
        id: 'countryCode',
        accessor: prop('countryCode'),
        className: 'text-left',
        maxWidth: 75,
        minWidth: 50,
      },
      {
        Header: 'League',
        id: 'amateurLeague',
        accessor: prop('amateurLeague'),
        className: 'text-left',
        maxWidth: 150,
        minWidth: 150,
      },
      {
        Header: 'Am. Team',
        id: 'amateurClubName',
        accessor: prop('amateurClubName'),
        className: 'text-left',
        maxWidth: 150,
        minWidth: 150,
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
);

export default DraftTable;
