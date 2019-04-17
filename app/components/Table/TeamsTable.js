/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class TeamsTable extends React.PureComponent {
  render() {
    const { teams } = this.props;
    let data = [];
    if (teams.length) {
      data = teams;
    }
    return (
      <div>
        <ReactTableFixedColumns
          resizable={false}
          data={teams}
          noDataText="Loading all that good stuff..."
          columns={[
            {
              Header: '#',
              id: 'rank',
              Cell: row => <div>{(row.viewIndex + 1)}</div>,
              className: 'text-left',
              maxWidth: 30,
              minWidth: 30,
              fixed: 'left',
              sortable: false,
            },
            {
              Header: 'Team',
              id: 'name',
              accessor: d => `${d.name}+${d.abbreviation}+${d.id}`,
              className: 'text-left team-cell',
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
              id: 'gamesPlayed',
              accessor: d => Number(d.stats.splits[0].gamesPlayed),
              maxWidth: 65,
              minWidth: 35,
            },
            {
              Header: 'W',
              id: 'wins',
              accessor: d => Number(d.stats.splits[0].wins),
              maxWidth: 65,
              minWidth: 35,
            },
            {
              Header: 'L',
              id: 'losses',
              accessor: d => Number(d.stats.splits[0].losses),
              maxWidth: 65,
              minWidth: 35,
            },
            {
              Header: 'OT',
              id: 'ot',
              accessor: d => Number(d.stats.splits[0].ot),
              maxWidth: 65,
              minWidth: 35,
            },
            {
              Header: 'Pts',
              id: 'points',
              accessor: d => Number(d.stats.splits[0].pts),
              maxWidth: 65,
              minWidth: 40,
            },
            {
              Header: 'P%',
              id: 'ptsPctg',
              accessor: d => Number(d.stats.splits[0].ptPctg),
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'GF',
              id: 'goalsfor',
              accessor: d => Math.round(d.stats.splits[0].gamesPlayed * d.stats.splits[0].goalsPerGame),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GA',
              id: 'goalsagainst',
              accessor: d => Math.round(d.stats.splits[0].gamesPlayed * d.stats.splits[0].goalsAgainstPerGame),
              maxWidth: 65,
              minWidth: 50,
            },
            {
              Header: 'GF/GP',
              id: 'goalsPerGame',
              accessor: d => parseFloat(d.stats.splits[0].goalsPerGame).toFixed(2),
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'GA/GP',
              id: 'goalsAgainstPerGame',
              accessor: d => parseFloat(d.stats.splits[0].goalsAgainstPerGame).toFixed(2),
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'Diff.',
              id: 'goaldiff',
              accessor: d => Number(d.stats.splits[0].goalsPerGame - d.stats.splits[0].goalsAgainstPerGame).toFixed(2),
              maxWidth: 65,
              minWidth: 55,
              sortMethod: (a, b) => (Number(a) > Number(b) ? 1 : -1),
            },
            {
              Header: 'PP%',
              id: 'powerPlayPercentage',
              accessor: d => Number(d.stats.splits[0].powerPlayPercentage).toFixed(1),
              maxWidth: 65,
              minWidth: 55,
            },
            {
              Header: 'PK%',
              id: 'penaltyKillPercentage',
              accessor: d => Number(d.stats.splits[0].penaltyKillPercentage).toFixed(1),
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
  }
}

TeamsTable.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default TeamsTable;
