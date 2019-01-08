/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Select from 'react-select';
import { find, propEq, pathOr, isEmpty } from 'ramda';
import 'react-table/react-table.css';
import './styles.scss';

const toLowerCaseAndMatch = (filter, row) => String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());

const saveStateToLS = (state) => {
    window.localStorage.setItem('playersFilters', JSON.stringify(state));
}

const getSavedState = () => {
  const savedState = window.localStorage.getItem('playersFilters');
  return savedState ? JSON.parse(savedState) : {};

}

const positions = [
  { value: "all", label: "All" },
  { value: "F", label: "Forward" },
  { value: "D", label: "Defenseman" },
  { value: "G", label: "Goalie" },
  { value: "C", label: "Center" },
  { value: "LW", label: "Left Wing" },
  { value: "RW", label: "Right Wing" },
]

//Team Dropdown Options
const teams = [
  { value: "all", label: "All" },
  { value: "ANA", label: "Anaheim Ducks" },
  { value: "ARI", label: "Arizona Coyotes" },
  { value: "BOS", label: "Boston Bruins" },
  { value: "BUF", label: "Buffalo Sabres" },
  { value: "CAR", label: "Carolina Hurricanes" },
  { value: "CBJ", label: "Columbus Blue Jackets" },
  { value: "CGY", label: "Calgary Flames" },
  { value: "CHI", label: "Chicago Blackhawks" },
  { value: "COL", label: "Colorado Avalanche" },
  { value: "DAL", label: "Dallas Stars" },
  { value: "DET", label: "Detroit Red Wings" },
  { value: "EDM", label: "Edmonton Oilers" },
  { value: "FLA", label: "Florida Panthers" },
  { value: "LAK", label: "Los Angeles Kings" },
  { value: "MIN", label: "Minnestota Wild" },
  { value: "MTL", label: "Montreal Canadiens" },
  { value: "NSH", label: "Nashville Predators" },
  { value: "NJD", label: "New Jersey Devils" },
  { value: "NYI", label: "New York Islanders" },
  { value: "NYR", label: "New York Rangers" },
  { value: "OTT", label: "Ottawa Senators" },
  { value: "PHI", label: "Philadelphia Flyers" },
  { value: "PIT", label: "Pittsburgh Penguins" },
  { value: "SJS", label: "San Jose Sharks" },
  { value: "STL", label: "St.Louis Blues" },
  { value: "TBL", label: "Tampa Bay Lightning" },
  { value: "TOR", label: "Toronto Maple Leafs" },
  { value: "VAN", label: "Vancouver Canucks" },
  { value: "VGK", label: "Vegas Golden Knights" },
  { value: "WPG", label: "Winnipeg Jets" },
  { value: "WSH", label: "Washington Capitals" },
]

const nationalities = [
  { value: "all", label: "All" },
  { value: "CAN", label: "Canada" },
  { value: "USA", label: "United States" },
  { value: "RUS", label: "Russia" },
  { value: "SWE", label: "Sweden" },
  { value: "FIN", label: "Finland" },
  { value: "CZE", label: "Czech Republic" },
  { value: "CHE", label: "Switzerland" },
  { value: "SVK", label: "Slovakia" },
  { value: "DEU", label: "Germany" },
  { value: "AUS", label: "Austria" },
  { value: "DNK", label: "Denmark" },
  { value: "FRA", label: "France" },
  { value: "LAT", label: "Latvia" },
  { value: "NOR", label: "Norway" },
  { value: "SVN", label: "Slovenia" },
  { value: "NLD", label: "Netherlands" },
  { value: "AUS", label: "Australia" },
]

//Dropdown Styles
const customStyles = {
  option: (provided, state) => ({
    ...provided,
  }),
  control: () => ({
  }),
}

class PlayersTable extends React.PureComponent {
  constructor() {
    super();
    this.state = getSavedState();
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleNatChange = this.handleNatChange.bind(this);
  }
  componentDidUpdate (){
    saveStateToLS(this.state);
  }
  handleNameChange(e) {
    this.setState({ nameSelected: e.target.value });
  }
  handlePosChange(target) {
    this.setState({ posSelected: target.value });
  }
  handleTeamChange(target) {
    this.setState({ teamSelected: target.value });
  }
  handleNatChange(target) {
    this.setState({ natSelected: target.value });
  }
  render() {
    const { players } = this.props;
    return (
      <div>
        <div className="filters">
          <div className="filters-item">
            <label>Filter By Player Name</label>
            <input
              placeholder="e.g. Wayne Gretzky"
              className="filters-input"
              type="text"
              onChange={this.handleNameChange}
              value={this.state.nameSelected}
            />
          </div>
          <div className="filters-item">
            <div className="filters-item-label">Filter By Position</div>
            <Select
              onChange={this.handlePosChange}
              classNamePrefix="react-select"
              defaultValue={positions[0]}
              options={positions}
              styles={customStyles}
              value={find(propEq('value', this.state.posSelected))(positions)}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                ...theme.colors,
                  primary: '#3D5AFE',
                  primary50: '#CBD1DB',
                  primary25: '#E2E7EC',
                },
              })}
            />
          </div>
          <div className="filters-item">
            <div className="filters-item-label">Filter By Team</div>
            <Select
              onChange={this.handleTeamChange}
              classNamePrefix="react-select"
              defaultValue={teams[0]}
              options={teams}
              styles={customStyles}
              value={find(propEq('value', this.state.teamSelected))(teams)}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                ...theme.colors,
                  primary: '#3D5AFE',
                  primary50: '#CBD1DB',
                  primary25: '#E2E7EC',
                },
              })}
            />
          </div>
          <div className="filters-item">
            <div className="filters-item-label">Filter By Nationality</div>
            <Select
              onChange={this.handleNatChange}
              classNamePrefix="react-select"
              defaultValue={teams[0]}
              options={nationalities}
              styles={customStyles}
              value={find(propEq('value', this.state.natSelected))(nationalities)}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                ...theme.colors,
                  primary: '#3D5AFE',
                  primary50: '#CBD1DB',
                  primary25: '#E2E7EC',
                },
              })}
            />
          </div>
        </div>
        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                console.log("A Td Element was clicked!");
                console.log("it produced this event:", e);
                console.log("It was in this column:", column);
                console.log("It was in this row:", rowInfo);
                console.log("It was in this table instance:", instance);

                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
          filtered={[
            {
              id: 'fullName',
              value: this.state.nameSelected || ''
            },
            {
              id: 'position',
              value: this.state.posSelected || 'all'
            },
            {
              id: 'team',
              value: this.state.teamSelected || 'all'
            },
            {
              id: 'nationality',
              value: this.state.natSelected || 'all'
            },
          ]}
          data={players}
          resizable={false}
          noDataText="Loading all dat good data stuff..."
          filterable
          defaultFilterMethod={toLowerCaseAndMatch}
          columns={[
            {
              Header: '#',
              id: 'rank',
              Cell: (row) => {
                return <div>{(row.viewIndex+1)+(row.page * row.pageSize)}</div>;
              },
              className: 'text-left',
              maxWidth: 50,
              minWidth: 50,
              filterable: false,
              sortable: false,
            },
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
              Header: 'Pos.',
              id: 'position',
              className: 'text-left',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['position', 'abbreviation'], d),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                else if (filter.value === 'F') {
                  return row[filter.id] === 'C' | row[filter.id] === 'LW' | row[filter.id] === 'RW';
                }
                return String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());
              }
            },
            {
              Header: 'Team',
              id: 'team',
              className: 'text-left team-cell border-right',
              maxWidth: 85,
              minWidth: 50,
              Cell: row => (
                <a href="./team?id=123">
                  <img src={`/images/teams/small/${row.value}.png`} />
                </a>
              ),
              accessor: d => pathOr(0, ['team', 'abbreviation'], d),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                return String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());
              },
            },
            {
              Header: 'Nat.',
              id: 'nationality',
              className: 'text-left team-cell hidden',
              maxWidth: 85,
              minWidth: 50,
              accessor: d => pathOr(0, ['info', 'nationality'], d),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                return String(row[filter.id]).toLowerCase().match(filter.value.toLowerCase());
              },
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
          defaultSortDesc={true}
          className="-striped player-stats"
        />
      </div>
    );
  }
}

PlayersTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PlayersTable;
