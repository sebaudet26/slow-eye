import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { isEmpty, pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const StandingsTable = ({ standings }) => (
  <div>
    <ReactTable
      showPagination={false}
      sortable={false}
      data={isEmpty(standings) ? [] : standings[2].teamRecords}
      columns={[
        {
          Header: 'Name',
          id: 'name',
          className: 'text-left',
          accessor: pathOr(0, ['team', 'name']),
          maxWidth: 200,
          minWidth: 125,
        },
        {
          Header: 'Points',
          id: 'points',
          className: 'text-left',
          accessor: pathOr('N/A', ['points']),
          maxWidth: 200,
          minWidth: 125,
        },
      ]}
      defaultPageSize={3}
      className="-striped -highlight career-stats"
    />
  </div>
);

StandingsTable.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default StandingsTable;
