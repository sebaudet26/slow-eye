import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import {
  isEmpty, pathOr, pipe, pick, join, values, prop,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import '../styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
class PlayersTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    console.log(players);
    return (
      <ReactTableFixedColumns
        resizable={false}
        data={players.row}
        defaultPageSize={20}
        defaultSortDesc
        defaultSorted={[
          {
            id: 'avg',
            desc: true,
          },
        ]}
        className=""
        columns={[
          {
            Header: '#',
            id: 'rank',
            className: 'text-center',
            Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
            maxWidth: 30,
            minWidth: 30,
            fixed: 'left',
          },
          {
            Header: 'Name',
            id: 'fullName',
            className: 'text-left border-mobile',
            accessor: d => d.name_display_first_last,
            maxWidth: 200,
            minWidth: 110,
            fixed: 'left',
          },
          {
            Header: 'Pos.',
            id: 'position',
            className: '',
            accessor: d => d.pos,
            maxWidth: 50,
            minWidth: 40,
            fixed: 'left',
          },
          {
            Header: 'Team',
            id: 'team',
            className: 'team-cell sm-margin',
            maxWidth: 60,
            minWidth: 50,
            fixed: 'left',
            accessor: d => d.team_id,
            Cell: row => (
              <div>
                <img className="team-cell-logo" src={`https://www.mlbstatic.com/team-logos/${row.value}.svg`} />
              </div>
            ),
          },
          {
            Header: 'G',
            id: 'games',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.g,
          },
          {
            Header: 'AB',
            id: 'ab',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.ab),
          },
          {
            Header: 'H',
            id: 'h',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.h,
          },
          {
            Header: 'AVG',
            id: 'avg',
            maxWidth: 65,
            minWidth: 55,
            filterable: false,
            accessor: d => d.avg,
          },
          {
            Header: 'HR',
            id: 'hr',
            maxWidth: 65,
            minWidth: 40,
            filterable: false,
            accessor: d => Number(d.hr),
          },
          {
            Header: 'RBI',
            id: 'rbi',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.rbi),
          },
          {
            Header: 'R',
            id: 'r',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.r),
          },
          {
            Header: 'BB',
            id: 'bb',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.bb),
          },
          {
            Header: 'SO',
            id: 'so',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.so),
          },
          {
            Header: 'SB',
            id: 'sb',
            maxWidth: 40,
            minWidth: 30,
            filterable: false,
            accessor: d => Number(d.sb),
          },
          {
            Header: 'CS',
            id: 'cs',
            maxWidth: 40,
            minWidth: 30,
            filterable: false,
            accessor: d => Number(d.cs),
          },
          {
            Header: 'OBP',
            id: 'obp',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.obp,
          },
          {
            Header: 'SLG',
            id: 'slg',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.slg,
          },
          {
            Header: 'OPS',
            id: 'ops',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.ops,
          },
        ]}

      />
    );
  }
}

export default PlayersTable;
