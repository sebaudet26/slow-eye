import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  isEmpty, pathOr, pipe, pick, join, values,
} from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';


// TODO: team logo and team link
const StandingsTable = ({ subStandings, isWildCardTable }) => (
  <ReactTable
    showPagination={false}
    sortable={false}
    data={subStandings.teamRecords}
    columns={[
      {
        Header: '',
        id: 'rank',
        className: 'text-center',
        accessor: pathOr(0, [isWildCardTable ? 'wildCardRank' : 'divisionRank']),
        maxWidth: 40,
        minWidth: 40,
      },
      {
        Header: isWildCardTable ? 'Wild Card' : subStandings.division.name,
        id: 'name',
        className: 'text-left border-right',
        accessor: pathOr(0, ['team', 'name']),
        maxWidth: 200,
        minWidth: 200,
      },
      {
        Header: '',
        id: 'logo',
        className: 'text-center',
        accessor: pathOr(0, ['team']),
        maxWidth: 70,
        minWidth: 70,
        Cell: row => (
          <a href={`./team?id=${row.value.id}`}>
            <img src={`/images/teams/small/${row.value.abbreviation.toUpperCase().replace(' ', '-')}.png`} />
          </a>
        ),
      },
      {
        Header: 'GP',
        id: 'games',
        className: 'text-center',
        accessor: pathOr(0, ['gamesPlayed']),
        maxWidth: 50,
        minWidth: 50,
      },
      {
        Header: 'W',
        id: 'wins',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'wins']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'L',
        id: 'losses',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'losses']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'OTL',
        id: 'otl',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'ot']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'Pts',
        id: 'points',
        className: 'text-center',
        accessor: pathOr(0, ['points']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'GF',
        id: 'goalsFor',
        className: 'text-center',
        accessor: pathOr(0, ['goalsScored']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'GA',
        id: 'goalsAgainst',
        className: 'text-center',
        accessor: pathOr(0, ['goalsAgainst']),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'Home',
        id: 'home',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 0]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'Away',
        id: 'away',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 1]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'S/O',
        id: 'streak',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 2]), pick(['wins', 'losses']), values, join('-')),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'L10',
        id: 'streak',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 3]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 70,
        minWidth: 70,
      },
      {
        Header: 'STRK',
        id: 'streak',
        className: 'text-center',
        accessor: pathOr('N/A', ['streak', 'code']),
        maxWidth: 70,
        minWidth: 70,
      },
    ]}
    defaultPageSize={subStandings.teamRecords.length}
    className="-striped standings-stats"
  />
);

StandingsTable.propTypes = {
  subStandings: PropTypes.shape({}).isRequired,
  isWildCardTable: PropTypes.bool.isRequired,
};

const Standings = ({ standings }) => (
  !isEmpty(standings) ? (
    <div>
      <h3 className="no-margin-top">Eastern Conference</h3>
      <StandingsTable subStandings={standings[3]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[2]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[0]} isWildCardTable />
      <h3>Western Conference</h3>
      <StandingsTable subStandings={standings[4]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[5]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[1]} isWildCardTable />
    </div>
  ) : null
);


Standings.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Standings;
