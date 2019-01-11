/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

class TeamsTable extends React.PureComponent {
  render() {
    const { teams } = this.props;
    return (
      <div>
        <ReactTable
          resizable={false}
          data={teams}
          noDataText="Loading all dat good data stuff..."
          columns={[
            {
              Header: '#',
              id: 'rank',
              Cell: row => <div>{(row.viewIndex + 1)}</div>,
              className: 'text-left',
              maxWidth: 50,
              minWidth: 50,
              sortable: false,
            },
            {
              Header: 'Team',
              id: 'name',
              accessor: d => `${d.name}+${d.abbreviation}+${d.id}`,
              className: 'text-left border-right team-cell',
              maxWidth: 250,
              minWidth: 200,
              Cell: row => (
                <a href={`./team?id=${row.value.split('+')[2]}`}>
                  <img src={`/images/teams/small/${row.value.split('+')[1]}.png`} />
                  {row.value.split('+')[0]}
                </a>
              ),
            },
            {
              Header: 'GP',
              id: 'gamesPlayed',
              accessor: d => d.stats.splits[0].gamesPlayed,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'W',
              id: 'wins',
              accessor: d => d.stats.splits[0].wins,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'L',
              id: 'losses',
              accessor: d => d.stats.splits[0].losses,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'OT',
              id: 'ot',
              accessor: d => d.stats.splits[0].ot,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              accessor: d => d.stats.splits[0].pts,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'P%',
              id: 'ptsPctg',
              accessor: d => d.stats.splits[0].ptPctg,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GF',
              id: 'goalsfor',
              accessor: d => Math.round(d.stats.splits[0].gamesPlayed * d.stats.splits[0].goalsPerGame),
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GA',
              id: 'goalsagainst',
              accessor: d => Math.round(d.stats.splits[0].gamesPlayed * d.stats.splits[0].goalsAgainstPerGame),
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GF/GP',
              id: 'goalsPerGame',
              accessor: d => parseFloat(d.stats.splits[0].goalsPerGame).toFixed(2),
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GA/GP',
              id: 'goalsAgainstPerGame',
              accessor: d => parseFloat(d.stats.splits[0].goalsAgainstPerGame).toFixed(2),
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'PP%',
              id: 'powerPlayPercentage',
              accessor: d => d.stats.splits[0].powerPlayPercentage,
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'PK%',
              id: 'penaltyKillPercentage',
              accessor: d => d.stats.splits[0].penaltyKillPercentage,
              maxWidth: 85,
              minWidth: 50,
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={20}
          defaultSortDesc
          defaultPageSize={teams.length}
          showPagination={false}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          className="-striped team-stats"
        />
      </div>
    );
  }
}

TeamsTable.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default TeamsTable;
