import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  isEmpty, pathOr, pipe, pick, join, values, prop,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
// TODO: team logo and team link
const StandingsTable = ({ records, tableHeader, isWildCardTable }) => (
  <ReactTableFixedColumns
    showPagination={false}
    sortable={false}
    resizable={false}
    data={records}
    columns={[
      {
        Header: '',
        id: 'rank',
        className: 'text-center',
        accessor: row => isWildCardTable ? row.conferenceRank : row.divisionRank,
        maxWidth: 40,
        minWidth: 40,
        fixed: 'left',
      },
      {
        Header: tableHeader,
        id: 'name',
        className: 'text-left team-cell',
        accessor: prop('teamId'),
        maxWidth: 300,
        minWidth: 125,
        fixed: 'left',
        Cell: row => (
          <a href={`./team?id=${row.value}`}>
            <svg key={Math.random()} className="team-cell-logo">
              <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${row.value}-20182019-light`} />
            </svg>
            <span className="hidden-mobile">{row.original.teamName}</span>
          </a>
        ),
      },
      {
        Header: 'GP',
        id: 'games',
        className: 'text-center',
        accessor: pathOr(0, ['gamesPlayed']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'W',
        id: 'wins',
        className: 'text-center',
        accessor: pathOr(0, ['record', 'wins']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'L',
        id: 'losses',
        className: 'text-center',
        accessor: pathOr(0, ['record', 'losses']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'OTL',
        id: 'otl',
        className: 'text-center',
        accessor: pathOr(0, ['record', 'ot']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'Pts',
        id: 'points',
        className: 'text-center',
        accessor: pathOr(0, ['points']),
        maxWidth: 65,
        minWidth: 50,
      },
      {
        Header: 'GF',
        id: 'goalsFor',
        className: 'text-center',
        accessor: pathOr(0, ['goalsScored']),
        maxWidth: 65,
        minWidth: 50,
      },
      {
        Header: 'GA',
        id: 'goalsAgainst',
        className: 'text-center',
        accessor: pathOr(0, ['goalsAgainst']),
        maxWidth: 65,
        minWidth: 50,
      },
      {
        Header: 'Home',
        id: 'home',
        className: 'text-center',
        accessor: pipe(pathOr({}, ['homeRecord']), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'Away',
        id: 'away',
        className: 'text-center',
        accessor: pipe(pathOr({}, ['awayRecord']), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'S/O',
        id: 'so',
        className: 'text-center',
        accessor: pipe(pathOr({}, ['shootOutsRecord']), pick(['wins', 'losses']), values, join('-')),
        maxWidth: 65,
        minWidth: 45,
      },
      {
        Header: 'L10',
        id: 'l10',
        className: 'text-center',
        accessor: pipe(pathOr({}, ['lastTenRecord']), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 80,
        minWidth: 60,
      },
      {
        Header: 'STRK',
        id: 'streak',
        className: 'text-center',
        accessor: pathOr('N/A', ['streak']),
        maxWidth: 70,
        minWidth: 50,
      },
    ]}
    defaultPageSize={records.length}
    className="standings-stats wildCard"
  />
);

StandingsTable.propTypes = {
  records: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableHeader: PropTypes.string.isRequired,
  isWildCardTable: PropTypes.bool.isRequired,
};

const Standings = ({ standings }) => (
  !isEmpty(standings) ? (
    <div>
      <h3 className="no-margin-top">Eastern Conference</h3>
      <StandingsTable 
        records={standings.filter(team => team.divisionName == "Atlantic" && (team.isDivisionLeader && team.divisionRank < 4))} 
        tableHeader={'Atlantic'}
        isWildCardTable={false} 
      />      
      <StandingsTable 
        records={standings.filter(team => team.divisionName == "Metropolitan" && (team.isDivisionLeader && team.divisionRank < 4))} 
        tableHeader={'Metropolitan'}
        isWildCardTable={false} 
      />
      <StandingsTable 
        records={standings.filter(team => team.conferencName == "Eastern" && (team.isWildCard || team.divisionRank > 3)).sort((a, b) => a.conferenceRank - b.conferenceRank)} 
        tableHeader={'Wild Card'}
        isWildCardTable 
      />

      <h3>Western Conference</h3>
      <StandingsTable 
        records={standings.filter(team => team.divisionName == "Central" && (team.isDivisionLeader && team.divisionRank < 4))} 
        tableHeader={'Central'}
        isWildCardTable={false} 
      />      
      <StandingsTable 
        records={standings.filter(team => team.divisionName == "Pacific" && (team.isDivisionLeader && team.divisionRank < 4))} 
        tableHeader={'Pacific'}
        isWildCardTable={false} 
      />
      <StandingsTable 
        records={standings.filter(team => team.conferencName == "Western" && (team.isWildCard || team.divisionRank > 3)).sort((a, b) => a.conferenceRank - b.conferenceRank)} 
        tableHeader={'Wild Card'}
        isWildCardTable 
      />
    </div>
  ) : null
);


Standings.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Standings;
