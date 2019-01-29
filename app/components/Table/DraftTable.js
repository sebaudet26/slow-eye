/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { map, pipe, prop } from 'ramda';
import PlayerName from '../PlayerName';
import TeamLogo from '../TeamLogo';
import { toLowerCaseAndMatch } from '../../utils/filter';
import 'react-table/react-table.css';
import './styles.scss';

const DraftTable = ({ draft, filters, round }) => {
  console.log(filters);
  return (
    <ReactTable
      data={draft}
      resizable={false}
      filtered={[
        {
          id: 'position',
          value: filters.posSelected,
        },
        {
          id: 'nationality',
          value: filters.natSelected,
        },
        {
          id: 'roundNumber',
          value: filters.roundSelected,
        },
      ]}
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
          Cell: pipe(
            prop('value'),
            map(prop('id')),
            map(id => <TeamLogo teamId={id} season={20172018} />),
          ),
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
          filterMethod: (filter, row) => {
            if (filter.value === 'S') {
              return row[filter.id] !== 'G';
            }
            if (filter.value === 'F') {
              return row[filter.id] === 'C' || row[filter.id] === 'LW' || row[filter.id] === 'RW';
            }
            return toLowerCaseAndMatch(filter, row);
          },
        },
        {
          Header: 'Nat.',
          id: 'nationality',
          accessor: prop('countryCode'),
          className: 'text-left team-cell',
          maxWidth: 75,
          minWidth: 50,
          Cell: row => (
            <img src={`/images/country/${row.value}.svg`} alt="" />
          ),
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
      ]}
      defaultSortAsc
      showPagination
      className="-striped draft-table"
      defaultPageSize={31}
    />
  );
};

export default DraftTable;
