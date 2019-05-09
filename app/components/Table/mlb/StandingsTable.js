import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  isEmpty, pathOr, pipe, pick, join, values, prop,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import '../styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
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
        accessor: d => d.divisionRank,
        maxWidth: 30,
        minWidth: 30,
        fixed: 'left',
      },
      {
        Header: 'Team',
        id: 'name',
        className: 'text-left team-cell',
        accessor: d => d.team.name,
        maxWidth: 300,
        minWidth: 125,
        fixed: 'left',
      },
      {
        Header: 'GP',
        id: 'games',
        className: 'text-center',
        accessor: d => d.gamesPlayed,
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'W',
        id: 'wins',
        className: 'text-center',
        accessor: d => d.wins,
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'L',
        id: 'losses',
        className: 'text-center',
        accessor: d => d.losses,
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'PCT',
        id: 'Pct',
        accessor: d => d.winningPercentage,
        maxWidth: 65,
        minWidth: 55,
      },
      {
        Header: 'GB',
        id: 'gb',
        className: 'text-center',
        accessor: d => d.gamesBack,
        maxWidth: 65,
        minWidth: 40,
      },
      {
        Header: 'RS',
        id: 'runsScored',
        className: 'text-center',
        accessor: d => d.runsScored,
        maxWidth: 65,
        minWidth: 50,
      },
      {
        Header: 'RA',
        id: 'runsAgainst',
        className: 'text-center',
        accessor: d => d.runsAllowed,
        maxWidth: 65,
        minWidth: 50,
      },
      {
        Header: 'Home',
        id: 'home',
        className: 'text-center',
        accessor: d => d.records.overallRecords[0].pct,
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'Away',
        id: 'away',
        className: 'text-center',
        accessor: d => d.records.overallRecords[1].pct,
        maxWidth: 90,
        minWidth: 80,
      },
      {
        Header: 'L10',
        id: 'l10',
        className: 'text-center',
        accessor: d => d.records.splitRecords[4].pct,
        maxWidth: 80,
        minWidth: 60,
      },
      {
        Header: 'STRK',
        id: 'streak',
        className: 'text-center',
        accessor: d => d.streak.streakCode,
        maxWidth: 70,
        minWidth: 50,
      },
    ]}
    defaultPageSize={subStandings.teamRecords.length}
    className="standings-stats"
  />
);

StandingsTable.propTypes = {
  subStandings: PropTypes.shape({}).isRequired,
};

const Standings = ({ standings }) => (
  !isEmpty(standings) ? (
    <div>
      <h3 className="no-margin-top">National League</h3>
      <StandingsTable subStandings={standings.records[0]} />
      <StandingsTable subStandings={standings.records[1]} />
      <StandingsTable subStandings={standings.records[2]} />
      <h3>American League</h3>
      <StandingsTable subStandings={standings.records[3]} />
      <StandingsTable subStandings={standings.records[4]} />
      <StandingsTable subStandings={standings.records[5]} />
    </div>
  ) : null
);

export default Standings;
