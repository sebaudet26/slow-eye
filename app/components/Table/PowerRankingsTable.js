/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import { prop } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const PowerRankingsTable = ({ teams }) => (
  <div>
    <ReactTableFixedColumns
      data={teams}
      resizable={false}
      noDataText="Loading all that good stuff..."
      columns={[
        {
          Header: '#',
          id: 'rank',
          className: 'text-left',
          Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
          maxWidth: 30,
          minWidth: 30,
          fixed: 'left',
          sortable: false,
        },
        {
          Header: 'Team',
          id: 'name',
          className: 'text-left team-cell',
          accessor: prop('name'),
          Cell: row => (
            <a href={`./team?id=${row.original.id}`}>
              <svg key={Math.random()} className="team-cell-logo">
                <use xlinkHref={`/images/teams/season/20182019.svg#team-${row.original.id}-20182019-light`} />
              </svg>
              <span className="hidden-mobile">{row.original.name}</span>
              <span className="hidden-desktop">{row.original.abbreviation}</span>
            </a>
          ),
          maxWidth: 300,
          minWidth: 125,
          fixed: 'left',
        },
        {
          Header: 'GP',
          id: 'gamesPlayed',
          accessor: prop('games'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'W',
          id: 'wins',
          accessor: prop('wins'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'L',
          id: 'losses',
          accessor: prop('losses'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'OT',
          id: 'ot',
          accessor: prop('ot'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: prop('points'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'P%',
          id: 'ptsPctg',
          accessor: d => (d.points / d.games).toFixed(2),
          maxWidth: 65,
          minWidth: 55,
        },
        {
          Header: 'GF',
          id: 'goalsfor',
          accessor: prop('goalsFor'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'GA',
          id: 'goalsagainst',
          accessor: prop('goalsAgainst'),
          maxWidth: 65,
          minWidth: 50,
        },
        {
          Header: 'GF/GP',
          id: 'goalsPerGame',
          accessor: d => (d.goalsFor / d.games).toFixed(2),
          maxWidth: 65,
          minWidth: 55,
        },
        {
          Header: 'GA/GP',
          id: 'goalsAgainstPerGame',
          accessor: d => (d.goalsAgainst / d.games).toFixed(2),
          maxWidth: 65,
          minWidth: 55,
        },
        {
          Header: 'Diff.',
          id: 'goaldiff',
          accessor: d => ((d.goalsFor - d.goalsAgainst) / d.games).toFixed(2),
          maxWidth: 65,
          minWidth: 55,
        },
      ]}
      defaultSortDesc
      defaultPageSize={31}
      showPagination={false}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
        },
      ]}
      className="teams-table"
    />
  </div>
);

PowerRankingsTable.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PowerRankingsTable;
