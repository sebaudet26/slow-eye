import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

const BoxTable = ({ players }) => (
  <div>
    <ReactTable
      resizable={false}
      noDataText="Loading all dat good data stuff..."
      sortable
      data={players}
      columns={[
        {
          Header: '#',
          id: 'number',
          accessor: pathOr('N/A', ['jerseyNumber']),
          className: '',
          maxWidth: 50,
          minWidth: 50,
        },
        {
          Header: 'Name',
          id: 'name',
          className: 'text-left border-right',
          accessor: pathOr('N/A', ['person', 'fullName']),
          maxWidth: 200,
          minWidth: 125,
        },
        {
          Header: 'G',
          id: 'goals',
          accessor: pathOr('N/A', ['boxscore', 'goals']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'A',
          id: 'assists',
          accessor: pathOr('N/A', ['boxscore', 'assists']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Pts',
          id: 'points',
          accessor: d => pathOr(0, ['boxscore', 'assists'], d) + pathOr(0, ['boxscore', 'goals'], d),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: '+/-',
          id: 'plusminus',
          accessor: pathOr('N/A', ['boxscore', 'plusMinus']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'penaltyminutes',
          accessor: pathOr('N/A', ['boxscore', 'penaltyMinutes']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: pathOr('N/A', ['boxscore', 'shots']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          accessor: pathOr('N/A', ['boxscore', 'hits']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Bks',
          id: 'blocks',
          accessor: pathOr('N/A', ['boxscore', 'blocked']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'GVA',
          id: 'giveaway',
          accessor: pathOr('N/A', ['boxscore', 'giveaways']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'TKA',
          id: 'takeaway',
          accessor: pathOr('N/A', ['boxscore', 'takeaways']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'FO%',
          id: 'faceoff',
          accessor: (d) => {
            const v = (pathOr(0, ['boxscore', 'faceOffWins'], d) / pathOr(0, ['boxscore', 'faceOffTaken'], d) * 100).toFixed();
            if (v === 'NaN') {
              return 'N/A';
            }
            return v;
          },
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'TOI',
          id: 'timeonice',
          accessor: pathOr(0, ['boxscore', 'timeOnIce']),
          maxWidth: 85,
          minWidth: 50,
        },
      ]}
      defaultSorted={[
        {
          id: 'number',
          desc: false,
        },
      ]}
      defaultPageSize={18}
      defaultSortDesc
      className="-striped boxscore"
      showPagination={false}
    />
  </div>
);

BoxTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default BoxTable;
