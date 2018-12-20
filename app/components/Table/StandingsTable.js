import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { isEmpty, pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const StandingsTable = ({ subStandings, isWildCardTable }) => (
  <ReactTable
    showPagination={false}
    sortable={false}
    data={subStandings.teamRecords}
    columns={[
      {
        Header: '',
        id: 'rank',
        className: 'text-left',
        accessor: pathOr(0, [isWildCardTable ? 'wildCardRank' : 'divisionRank']),
        maxWidth: 40,
        minWidth: 40,
      },
      {
        Header: isWildCardTable ? 'Wild Card' : subStandings.division.name,
        id: 'name',
        className: 'text-left',
        accessor: pathOr(0, ['team', 'name']),
        maxWidth: 200,
        minWidth: 200,
      },
      {
        Header: 'Games',
        id: 'games',
        className: 'text-center',
        accessor: pathOr(0, ['gamesPlayed']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'Wins',
        id: 'wins',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'wins']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'Losses',
        id: 'losses',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'losses']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'OTL',
        id: 'otl',
        className: 'text-center',
        accessor: pathOr(0, ['leagueRecord', 'ot']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'Points',
        id: 'points',
        className: 'text-center',
        accessor: pathOr(0, ['points']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'GF',
        id: 'goalsFor',
        className: 'text-center',
        accessor: pathOr(0, ['goalsScored']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'GA',
        id: 'goalsAgainst',
        className: 'text-center',
        accessor: pathOr(0, ['goalsAgainst']),
        maxWidth: 75,
        minWidth: 75,
      },
      {
        Header: 'Streak',
        id: 'streak',
        className: 'text-center',
        accessor: pathOr('N/A', ['streak', 'code']),
        maxWidth: 75,
        minWidth: 75,
      },
    ]}
    defaultPageSize={subStandings.teamRecords.length}
    className="-striped -highlight standings-stats"
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
      <StandingsTable subStandings={standings[2]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[3]} isWildCardTable={false} />
      <StandingsTable subStandings={standings[0]} isWildCardTable />
      <h3 className="no-margin-top">Western Conference</h3>
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
