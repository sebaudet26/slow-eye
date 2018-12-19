/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { pathOr } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const toLowerCaseAndMatch = (filter, row) => String(row[filter.id])
  .toLowerCase()
  .match(filter.value.toLowerCase());

class PlayersTable extends React.PureComponent {
  render() {
    const { players } = this.props;
    return (
      <div>
        <ReactTable
          data={players}
          noDataText="Loading all dat good data stuff..."
          filterable
          defaultFilterMethod={toLowerCaseAndMatch}
          columns={[
            {
              Header: 'Name',
              id: 'fullName',
              accessor: d => d.person.fullName,
              className: 'text-left',
              maxWidth: 200,
              minWidth: 125,
              Cell: row => (
                <a href={`/player?id=${JSON.stringify(row.original.id)}`}>
                  {row.value}
                </a>
              ),
            },
            {
              Header: 'Team',
              id: 'team',
              className: 'text-left team-cell',
              maxWidth: 85,
              minWidth: 50,
              Cell: row=> (
                <a href='./team?id=123'>
                  <img src={`/images/teams/small/${row.value}.png`} />
                </a>
              ),
              accessor: d => pathOr(0, ['team', 'abbreviation'], d),
              filterMethod: (filter, row) => {
                if (filter.value === "all") {
                  return true;
                }
                return String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: "100%" }}
                  value={filter ? filter.value : "all"}
                >
                  <option value="all">All</option>
                  <option value="ANA">Anaheim</option>
                  <option value="ARI">Arizona Coyotes</option>
                  <option value="BOS">Boston Bruins</option>
                  <option value="BUF">Buffalo Sabres</option>
                  <option value="CAR">Carolina Hurricanes</option>
                  <option value="CBJ">Columbus Blue Jackets</option>
                  <option value="CGY">Calgary Flames</option>
                  <option value="CHI">Chicago Blackhawks</option>
                  <option value="COL">Colorado Avalanche</option>
                  <option value="DAL">Dallas Stars</option>
                  <option value="DET">Detroit Red Wings</option>
                  <option value="EDM">Edmonton Oilers</option>
                  <option value="FLA">Florida Panthers</option>
                  <option value="LAK">Los Angeles Kings</option>
                  <option value="MIN">Minnestota Wild</option>
                  <option value="MTL">Montreal Canadiens</option>
                  <option value="NSH">Nashville Predators</option>
                  <option value="NJD">New Jersey Devils</option>
                  <option value="NYI">New York Islanders</option>
                </select>
            },
            {
              Header: 'Pos.',
              id: 'position',
              className: 'text-left border-right',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['position', 'abbreviation'], d),
              filterMethod: (filter, row) => {
                if (filter.value === "all") {
                  return true;
                }
                return String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: "100%" }}
                  value={filter ? filter.value : "all"}
                >
                  <option value="all">All</option>
                  <option value="C">C</option>
                  <option value="LW">LW</option>
                  <option value="RW">RW</option>
                  <option value="D">D</option>
                  <option value="G">G</option>
                </select>
            },
            {
              Header: 'GP',
              id: 'games',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'games'], d),
            },
            {
              Header: 'G',
              id: 'goals',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'goals'], d),
            },
            {
              Header: 'A',
              id: 'assists',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'assists'], d),
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'points'], d),
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'plusMinus'], d),
            },
            {
              Header: 'PIM',
              id: 'pim',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'pim'], d),
            },
            {
              Header: 'Hits',
              id: 'hits',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'hits'], d),
            },
            {
              Header: 'Bks',
              id: 'blocked',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'blocked'], d),
            },
            {
              Header: 'SOG',
              id: 'shots',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shots'], d),
            },
            {
              Header: 'S%',
              id: 'shotPct',
              maxWidth: 85,
              minWidth: 50,
              filterable: false,
              accessor: d => pathOr(0, ['stats', 0, 'stat', 'shotPct'], d),
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
          ]}
          defaultPageSize={20}
          className="-striped -highlight player-stats"
        />
      </div>
    );
  }
}

PlayersTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PlayersTable;
