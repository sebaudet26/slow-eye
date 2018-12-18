import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

class StandingsTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactTable
          showPagination={false}
          sortable={false}
          columns={[
            {
              Header: 'Test',
              id: 'fullName',
              className: 'text-left',
              accessor: 'test',
              maxWidth: 200,
              minWidth: 125,
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight career-stats"
        />
      </div>
    );
  }
}

StandingsTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default StandingsTable;
