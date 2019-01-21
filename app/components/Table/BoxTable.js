import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import { sortTimeOnIce } from '../../utils/sort';
import 'react-table/react-table.css';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const BoxTable = ({ players, goalieMode }) => (
  <div>
    <ReactTableFixedColumns
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
          fixed: 'left',
          maxWidth: 50,
          minWidth: 50,
        },
        {
          Header: 'Name',
          id: 'name',
          className: 'text-left border-right',
          accessor: pathOr('-', ['person', 'fullName']),
          Cell: row => (
            <a href={`/player?id=${JSON.stringify(row.original.person.id)}`}>
              {row.value}
            </a>
          ),
          fixed: 'left',
          maxWidth: 200,
          minWidth: 150,
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
          Header: 'PIM',
          id: 'penaltyminutesGoalie',
          show: goalieMode,
          accessor: pathOr('-', ['boxscore', 'pim']),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SV%',
          id: 'savePercentage',
          show: goalieMode,
          accessor: d => (pathOr(0, ['boxscore', 'savePercentage'], d) / 100).toFixed(3),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'PPSv%',
          id: 'powerPlaySavePercentage',
          show: goalieMode,
          accessor: d => (pathOr(0, ['boxscore', 'powerPlaySavePercentage'], d) / 100).toFixed(3),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'EVSv%',
          id: 'evenStrengthSavePercentage',
          show: goalieMode,
          accessor: d => (pathOr(0, ['boxscore', 'evenStrengthSavePercentage'], d) / 100).toFixed(3),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'SHSv%',
          id: 'shortHandedSavePercentage',
          show: goalieMode,
          accessor: d => (pathOr(0, ['boxscore', 'shortHandedSavePercentage'], d) / 100).toFixed(3),
          maxWidth: 85,
          minWidth: 50,
        },
        {
          Header: 'TOI',
          id: 'timeonice',
          accessor: pathOr('-', ['boxscore', 'timeOnIce']),
          maxWidth: 85,
          minWidth: 60,
          sortMethod: sortTimeOnIce,
        },
      ]}
      defaultSorted={[
        {
          id: 'points',
          desc: true,
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
