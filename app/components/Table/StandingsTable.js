import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  isEmpty, pathOr, pipe, pick, join, values,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
// TODO: team logo and team link
const StandingsTable = ({ subStandings, isWildCardTable }) => (
  <ReactTableFixedColumns
    showPagination={false}
    sortable={false}
    resizable={false}
    data={subStandings.teamRecords}
    columns={[
      {
        Header: '',
        id: 'rank',
        className: 'text-center',
        accessor: pathOr(0, [isWildCardTable ? 'wildCardRank' : 'divisionRank']),
        maxWidth: 30,
        minWidth: 30,
        fixed: 'left',
      },
      {
        Header: isWildCardTable ? 'Wild Card' : subStandings.division.name,
        id: 'name',
        className: 'text-left team-cell',
        accessor: d => `${d.team.name}+${d.team.abbreviation}+${d.team.id}`,
        maxWidth: 300,
        minWidth: 125,
        fixed: 'left',
        Cell: row => (
          <a href={`./team?id=${row.value.split('+')[2]}`}>
            <svg key={Math.random()} className="team-cell-logo">
              <use xlinkHref={`/images/teams/season/20182019.svg#team-${row.value.split('+')[2]}-20182019-light`} />
            </svg>
            <span className="hidden-mobile">{row.value.split('+')[0]}</span>
            <span className="hidden-desktop">{row.value.split('+')[1]}</span>
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
        accessor: pathOr(0, ['leagueRecord', 'wins']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'L',
        id: 'losses',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'losses']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'OTL',
        id: 'otl',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'ot']),
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'Pts',
        id: 'points',
        className: 'text-center',
        accessor: pathOr(0, ['points']),
        maxWidth: 65,
        minWidth: 40,
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
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 0]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'Away',
        id: 'away',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 1]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'S/O',
        id: 'so',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 2]), pick(['wins', 'losses']), values, join('-')),
        maxWidth: 65,
        minWidth: 45,
      },
      {
        Header: 'L10',
        id: 'l10',
        className: 'text-center',
        accessor: pipe(pathOr('N/A', ['records', 'overallRecords', 3]), pick(['wins', 'losses', 'ot']), values, join('-')),
        maxWidth: 80,
        minWidth: 60,
      },
      {
        Header: 'STRK',
        id: 'streak',
        className: 'text-center',
        accessor: pathOr('N/A', ['streak', 'code']),
        maxWidth: 70,
        minWidth: 50,
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
