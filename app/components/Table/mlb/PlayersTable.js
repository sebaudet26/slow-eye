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
  constructor() {
    super();
  }

  render() {
    const { players, type } = this.props;
    return (
      <ReactTableFixedColumns
        resizable={false}
        data={players.row}
        defaultPageSize={20}
        defaultSortDesc
        defaultSorted={[
          {
            id: 'wins',
            desc: true,
          },
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
            show: this.props.type === 'hitting' ? true : null,
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
            Header: 'W',
            id: 'wins',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.w,
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'L',
            id: 'losses',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.l,
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'ERA',
            id: 'era',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.era,
            sortMethod: (a, b) => (a > b ? -1 : 1),
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'IP',
            id: 'ip',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.ip,
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'SV',
            id: 'sv',
            maxWidth: 55,
            minWidth: 40,
            filterable: false,
            accessor: d => d.sv,
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'SVO',
            id: 'svo',
            maxWidth: 55,
            minWidth: 40,
            filterable: false,
            accessor: d => d.svo,
            show: this.props.type === 'pitching' ? true : null,
          },
          {
            Header: 'AB',
            id: 'ab',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => Number(d.ab),
            show: this.props.type === 'hitting' ? true : null,
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
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'AVG',
            id: 'pavg',
            maxWidth: 65,
            minWidth: 55,
            filterable: false,
            accessor: d => d.avg,
            sortMethod: (a, b) => (a > b ? -1 : 1),
            show: this.props.type === 'pitching' ? true : null,
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
            show: this.props.type === 'hitting' ? true : null,
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
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'CS',
            id: 'cs',
            maxWidth: 40,
            minWidth: 30,
            filterable: false,
            accessor: d => Number(d.cs),
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'OBP',
            id: 'obp',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.obp,
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'SLG',
            id: 'slg',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.slg,
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'OPS',
            id: 'ops',
            maxWidth: 65,
            minWidth: 50,
            filterable: false,
            accessor: d => d.ops,
            show: this.props.type === 'hitting' ? true : null,
          },
          {
            Header: 'WHIP',
            id: 'whip',
            maxWidth: 65,
            minWidth: 55,
            filterable: false,
            accessor: d => d.whip,
            show: this.props.type === 'pitching' ? true : null,
          },
        ]}

      />
    );
  }
}

export default PlayersTable;
