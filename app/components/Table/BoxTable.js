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

class BoxTable extends React.PureComponent {
  constructor() {
    super();
    this.state = getSavedState();
  }
  componentDidUpdate (){
    saveStateToLS(this.state);
  }
  render() {
    return (
      <div>
        <ReactTable
          resizable={false}
          noDataText="Loading all dat good data stuff..."
          sortable="true"
          columns={[
            {
              Header: '#',
              id: 'number',
              className: '',
              maxWidth: 50,
              minWidth: 50,
            },
            {
              Header: 'Name',
              id: 'name',
              className: 'text-left border-right',
              maxWidth: 200,
              minWidth: 125,
            },
            {
              Header: 'G',
              id: 'goals',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'A',
              id: 'assists',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: '+/-',
              id: 'plusminus',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'PIM',
              id: 'penaltyminutes',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'SOG',
              id: 'shots',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'Hits',
              id: 'hits',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'Bks',
              id: 'blocks',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'GVA',
              id: 'giveaway',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'TKA',
              id: 'takeaway',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'FO%',
              id: 'faceoff',
              maxWidth: 85,
              minWidth: 50,
            },
            {
              Header: 'TOI',
              id: 'timeonice',
              maxWidth: 85,
              minWidth: 50,
            }
          ]}
          defaultSorted={[
            {
              id: 'number',
              desc: false,
            },
          ]}
          defaultPageSize={18}
          defaultSortDesc={true}
          className="-striped boxscore"
          showPagination={false}
        />
      </div>
    );
  }
}

export default BoxTable;
