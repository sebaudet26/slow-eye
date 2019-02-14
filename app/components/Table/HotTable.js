/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import {
  last,
  map,
  pipe,
  pathOr,
  invoker,
  prop,
} from 'ramda';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import PlayerName from '../PlayerName';
import TeamLogo from '../TeamLogo';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const HotTable = ({ players }) => (
  <div>
    <ReactTableFixedColumns
      resizable={false}
      data={players}
      noDataText="Loading all good stuff..."
      columns={[
        {
          Header: '#',
          id: 'rank',
          Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
          className: 'text-left',
          sortable: false,
          fixed: 'left',
          maxWidth: 30,
          minWidth: 30,
        },
        {
          Header: 'Name',
          id: 'fullName',
          className: 'text-left',
          Cell: row => <PlayerName id={row.original.id} name={row.value} />,
          accessor: prop('name'),
          className: 'text-left border-mobile',
          fixed: 'left',
          maxWidth: 200,
          minWidth: 150,
        },
        {
          Header: 'Pos',
          id: 'position',
          className: 'text-left hidden-mobile',
          accessor: prop('positionCode'),
          maxWidth: 50,
          minWidth: 50,
          fixed: 'left',
        },
        {
          Header: 'Team',
          id: 'team',
          className: 'text-left team-cell sm-margin hidden-mobile',
          accessor: prop('teamId'),
          maxWidth: 85,
          minWidth: 75,
          fixed: 'left',
          Cell: row => <TeamLogo key={row.value} teamId={row.value} season="20182019" />,
        },
        {
          Header: 'GP',
          id: 'games',
          accessor: prop('games'),
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'G',
          id: 'goals',
          accessor: prop('goals'),
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'A',
          id: 'assists',
          accessor: prop('assists'),
          maxWidth: 75,
          minWidth: 35,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: prop('points'),
          maxWidth: 75,
          minWidth: 45,
        },
        {
          Header: 'Pts/GP',
          id: 'pointsPerGame',
          accessor: d => (d.points / d.games).toFixed(2),
          maxWidth: 75,
          minWidth: 60,
        },
        {
          Header: '+/-',
          id: 'plusMinus',
          accessor: prop('plusMinus'),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'pim',
          accessor: prop('pim'),
          maxWidth: 55,
          minWidth: 50,
        },
        {
          Header: 'PPP',
          id: 'powerPlayPoints',
          accessor: prop('powerPlayPoints'),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: prop('shots'),
          maxWidth: 75,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          accessor: prop('hits'),
          maxWidth: 75,
          minWidth: 50,
        },
      ]}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
        },
      ]}
      defaultSortDesc
      className="-striped roster-stats"
      defaultPageSize={10}
    />
  </div>
);

HotTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default HotTable;
