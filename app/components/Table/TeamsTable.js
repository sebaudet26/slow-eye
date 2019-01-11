/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

const saveStateToLS = (state) => {
    window.localStorage.setItem('playersFilters', JSON.stringify(state));
}

const getSavedState = () => {
  const savedState = window.localStorage.getItem('playersFilters');
  return savedState ? JSON.parse(savedState) : {};
}

class TeamsTable extends React.PureComponent {
  constructor() {
    super();
    this.state = getSavedState();
  }
  componentDidUpdate (){
    saveStateToLS(this.state);
  }
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
              className: '',
              maxWidth: 50,
              minWidth: 50,
              sortable: false,
            },
            {
              Header: 'Team',
              id: 'teamName',
              className: '',
              maxWidth: 200,
              minWidth: 125,
            },
            {
              Header: 'GP',
              id: 'gamesPlayed',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'W',
              id: 'wins',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'L',
              id: 'losses',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'OT',
              id: 'ot',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'pts',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'P%',
              id: 'ptsPctg',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GF',
              id: 'goalsfor',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GA',
              id: 'goalsagainst',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'SOW',
              id: 'sowin',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GF/GP',
              id: 'goalsPerGame',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GA/GP',
              id: 'goalsAgainstPerGame',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'PP%',
              id: 'powerPlayPercentage',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'PK%',
              id: 'penaltyKillPercentage',
              maxWidth: 85,
              minWidth: 50,
            }
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={20}
          defaultSortDesc={true}
          className="-striped team-stats"
        />
      </div>
    );
  }
}

export default TeamsTable;
