import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './styles.scss';

const BoxTable = ({ players, goalieMode }) => (
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
          accessor: pathOr('-', ['jerseyNumber']),
          className: '',
          maxWidth: 50,
          minWidth: 50,
        },
        {
          Header: 'Name',
          id: 'name',
          className: 'text-left border-right',
          accessor: pathOr('-', ['person', 'fullName']),
          maxWidth: 200,
          minWidth: 200,
        },
        {
          Header: 'G',
          id: 'goals',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'goals']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'A',
          id: 'assists',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'assists']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Pts',
          id: 'points',
          show: !goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'assists'], d) + pathOr(0, ['boxscore', 'goals'], d),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: '+/-',
          id: 'plusminus',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'plusMinus']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'penaltyminutes',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'penaltyMinutes']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'PIM',
          id: 'penaltyminutesGoalie',
          show: goalieMode,
          accessor: pathOr('-', ['boxscore', 'pim']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SOG',
          id: 'shots',
          accessor: pathOr('-', ['boxscore', 'shots']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Hits',
          id: 'hits',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'hits']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'Bks',
          id: 'blocks',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'blocked']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'GVA',
          id: 'giveaway',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'giveaways']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'TKA',
          id: 'takeaway',
          show: !goalieMode,
          accessor: pathOr('-', ['boxscore', 'takeaways']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'FO%',
          id: 'faceoff',
          show: !goalieMode,
          accessor: (d) => {
            const v = (pathOr(0, ['boxscore', 'faceOffWins'], d) / pathOr(0, ['boxscore', 'faceOffTaken'], d) * 100).toFixed();
            if (v === 'NaN') {
              return '-';
            }
            return v;
          },
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'TOI',
          id: 'timeonice',
          accessor: pathOr('-', ['boxscore', 'timeOnIce']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'GA',
          id: 'goalsAgainst',
          show: goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'shots'], d) - pathOr(0, ['boxscore', 'saves'], d),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SV',
          id: 'saves',
          show: goalieMode,
          accessor: pathOr('-', ['boxscore', 'saves']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SV%',
          id: 'savePercentage',
          show: goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'savePercentage'], d).toFixed(1),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'PPSv%',
          id: 'powerPlaySavePercentage',
          show: goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'powerPlaySavePercentage'], d).toFixed(1),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'EVSv%',
          id: 'evenStrengthSavePercentage',
          show: goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'evenStrengthSavePercentage'], d).toFixed(1),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SHSv%',
          id: 'shortHandedSavePercentage',
          show: goalieMode,
          accessor: d => pathOr(0, ['boxscore', 'shortHandedSavePercentage'], d).toFixed(1),
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
      defaultPageSize={players.length}
      defaultSortDesc
      className="-striped boxscore"
      showPagination={false}
    />
  </div>
);

BoxTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  goalieMode: PropTypes.bool.isRequired,
};

export default BoxTable;
