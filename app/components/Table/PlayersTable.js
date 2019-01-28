/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Select from 'react-select';
import {
  any, find, propEq, pathOr, pipe, prop, propOr, map, match, toLower, toString, split, replace, length, not, reject, isNil,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import { sortTimeOnIce } from '../../utils/sort';
import FilterIcon from './images/filter.svg';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
const isGoalie = pos => pos === 'G';
const toLowerCaseAndMatch = (filter, row) => String(row[filter.id])
  .toLowerCase()
  .match(filter.value.toLowerCase());

const saveStateToLS = (state) => {
  window.localStorage.setItem('playersFilters', JSON.stringify(state));
};

const getSavedState = () => {
  const savedState = window.localStorage.getItem('playersFilters');
  return savedState ? JSON.parse(savedState) : {};
};

const positions = [
  { value: 'S', label: 'Skaters' },
  { value: 'F', label: 'Forwards' },
  { value: 'D', label: 'Defensemen' },
  { value: 'G', label: 'Goalies' },
  { value: 'C', label: 'Centers' },
  { value: 'L', label: 'Left Wings' },
  { value: 'R', label: 'Right Wings' },
];

// Team Dropdown Options
const baseTeamOptions = [
  { value: 'all', label: 'All Teams' },
];

const nationalities = [
  { value: 'all', label: 'All' },
  { value: 'CAN', label: 'Canada' },
  { value: 'USA', label: 'United States' },
  { value: 'RUS', label: 'Russia' },
  { value: 'SWE', label: 'Sweden' },
  { value: 'FIN', label: 'Finland' },
  { value: 'CZE', label: 'Czech Republic' },
  { value: 'CHE', label: 'Switzerland' },
  { value: 'SVK', label: 'Slovakia' },
  { value: 'DEU', label: 'Germany' },
  { value: 'AUT', label: 'Austria' },
  { value: 'DNK', label: 'Denmark' },
  { value: 'FRA', label: 'France' },
  { value: 'LVA', label: 'Latvia' },
  { value: 'NOR', label: 'Norway' },
  { value: 'SVN', label: 'Slovenia' },
  { value: 'NLD', label: 'Netherlands' },
  { value: 'AUS', label: 'Australia' },
  { value: 'BLR', label: 'Belarus' },
  { value: 'UKR', label: 'Ukraine' },
  { value: 'KAZ', label: 'Kazakhstan' },
];

const experience = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Rookie' },
  { value: 'false', label: 'Veteran' },
];

const seasons = [];
for (let y = 2019; y > 1917; y--) {
  seasons.push({
    value: Number(`${y - 1}${y}`),
    label: `${y - 1}-${y}`,
  });
}

// Dropdown Styles
const customStyles = {
  option: (provided, state) => ({
    ...provided,
  }),
  control: () => ({
  }),
};

class PlayersTable extends React.PureComponent {
  constructor() {
    super();
    this.state = getSavedState();
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleNatChange = this.handleNatChange.bind(this);
    this.handleXPChange = this.handleXPChange.bind(this);
  }

  componentDidMount() {
    const { seasonSelected } = this.state;
    const { fetchPlayers, fetchTeams } = this.props;
    fetchPlayers(seasonSelected || seasons[0].value);
    fetchTeams(seasonSelected || seasons[0].value);
  }

  componentDidUpdate() {
    saveStateToLS(this.state);
  }

  handleSeasonChange(target) {
    const { fetchPlayers, fetchTeams } = this.props;
    this.setState({ seasonSelected: target.value, teamSelected: baseTeamOptions[0].value });
    fetchPlayers(target.value);
    fetchTeams(target.value);
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

  handleXPChange(target) {
    this.setState({ XPSelected: target.value });
  }

  filterToggle() {
    document.querySelector('.filters').classList.toggle('active');
  }

  // TODO: selectors should live in the container and pass down their state
  render() {
    const { players, teams } = this.props;
    console.log(this.state);
    const {
      seasonSelected, posSelected, natSelected, teamSelected, XPSelected,
    } = this.state;
    const teamOptions = [
      // All option is always first
      ...baseTeamOptions,
      // Teams are sorted alphabetically
      // in the reducer when added to the store
      ...(teams || []).map(t => ({ value: t.abbreviation, label: t.name })),
    ];
    return (
      <div>
        <div className="filter-toggle" onClick={this.filterToggle}>
          <img src={FilterIcon} alt="Filter Icon" />
          Show/Hide Filters
        </div>
        <div className="filters">
          <div className="filters-item">
            <div className="filters-item-label">Filter By Season</div>
            <Select
              onChange={this.handleSeasonChange}
              classNamePrefix="react-select"
              defaultValue={seasons[0]}
              options={seasons}
              styles={customStyles}
              value={find(propEq('value', seasonSelected))(seasons)}
              theme={theme => ({
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
            <div className="filters-item-label">Filter By Position</div>
            <Select
              onChange={this.handlePosChange}
              classNamePrefix="react-select"
              defaultValue={positions[0]}
              options={positions}
              styles={customStyles}
              value={find(propEq('value', posSelected))(positions)}
              theme={theme => ({
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
              defaultValue={teamOptions[0]}
              options={teamOptions}
              styles={customStyles}
              value={find(propEq('value', teamSelected))(teamOptions)}
              theme={theme => ({
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
              defaultValue={nationalities[0]}
              options={nationalities}
              styles={customStyles}
              value={find(propEq('value', natSelected))(nationalities)}
              theme={theme => ({
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
            <div className="filters-item-label">Filter By Experience</div>
            <Select
              onChange={this.handleXPChange}
              classNamePrefix="react-select"
              defaultValue={experience[0]}
              options={experience}
              styles={customStyles}
              value={find(propEq('value', XPSelected))(experience)}
              theme={theme => ({
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
        <ReactTableFixedColumns
          filtered={[
            {
              id: 'position',
              value: posSelected || 'S',
            },
            {
              id: 'team',
              value: teamSelected || 'all',
            },
            {
              id: 'nationality',
              value: natSelected || 'all',
            },
            {
              id: 'experience',
              value: XPSelected || 'all',
            },
          ]}
          data={players}
          resizable={false}
          noDataText="Loading all dat good data stuff..."
          filterable
          defaultFilterMethod={toLowerCaseAndMatch}
          getTdProps={(state, rowInfo, column, instance) => ({
            onClick: (e, handleOriginal) => {
              if (handleOriginal) {
                handleOriginal();
              }
            },
          })}
          columns={[
            {
              Header: '#',
              id: 'rank',
              Cell: row => <div>{(row.viewIndex + 1) + (row.page * row.pageSize)}</div>,
              className: 'text-left',
              maxWidth: 30,
              minWidth: 30,
              filterable: false,
              sortable: false,
              fixed: 'left',
            },
            {
              Header: 'Name',
              id: 'fullName',
              accessor: prop('name'),
              className: 'text-left border-mobile',
              maxWidth: 200,
              minWidth: 125,
              fixed: 'left',
              Cell: row => (
                <a href={`/player?id=${JSON.stringify(row.original.id)}`}>
                  {row.value}
                </a>
              ),
            },
            {
              Header: 'Pos',
              id: 'position',
              className: 'text-left hidden-mobile',
              maxWidth: 50,
              minWidth: 50,
              fixed: 'left',
              accessor: prop('positionCode'),
              filterMethod: (filter, row) => {
                if (filter.value === 'S') {
                  return row[filter.id] !== 'G';
                }
                if (filter.value === 'F') {
                  return row[filter.id] === 'C' || row[filter.id] === 'LW' || row[filter.id] === 'RW';
                }
                return pipe(
                  prop(filter.id),
                  toString,
                  toLower,
                  match(toLower(prop('value', filter))),
                  length,
                )(row);
              },
            },
            {
              Header: 'Team',
              id: 'team',
              className: 'text-left team-cell sm-margin hidden-mobile',
              maxWidth: 85,
              minWidth: 75,
              fixed: 'left',
              Cell: row => (
                row.value.map(t => (
                  <svg key={Math.random()} className="team-cell-logo">
                    <use xlinkHref={`/images/teams/season/${seasonSelected}.svg#team-${t.id}-${seasonSelected}-light`} />
                  </svg>
                ))
              ),
              accessor: prop('teams'),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                return pipe(
                  prop(filter.id),
                  reject(isNil),
                  map(prop('abbreviation')),
                  map(toLower),
                  map(replace(/\s/g, '')),
                  // map(replace(/"/g, '')),
                  map(pipe(match(toLower(filter.value)), length, Boolean)),
                  any(v => v),
                )(row);
              },
            },
            {
              Header: 'Nat.',
              id: 'nationality',
              className: 'text-left team-cell hidden',
              maxWidth: 85,
              minWidth: 50,
              accessor: prop('nationality'),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                return pipe(
                  prop(filter.id),
                  toString,
                  toLower,
                  match(toLower(prop('value', filter))),
                  length,
                )(row);
              },
            },
            {
              Header: 'XP',
              id: 'experience',
              className: 'text-left team-cell hidden',
              maxWidth: 85,
              minWidth: 50,
              accessor: prop('rookie'),
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                return String(row[filter.id]).match(filter.value);
              },
            },
            {
              Header: 'GP',
              id: 'games',
              maxWidth: 65,
              minWidth: 35,
              filterable: false,
              accessor: prop('gamesPlayed'),
            },
            {
              Header: 'G',
              id: 'goals',
              maxWidth: 65,
              minWidth: 35,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('goals'),
            },
            {
              Header: 'A',
              id: 'assists',
              maxWidth: 65,
              minWidth: 35,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('assists'),
            },
            {
              Header: 'Pts',
              id: 'points',
              maxWidth: 65,
              minWidth: 40,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('points'),
            },
            {
              Header: '+/-',
              id: 'plusMinus',
              maxWidth: 65,
              minWidth: 40,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('plusMinus'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'PIM',
              id: 'pim',
              maxWidth: 65,
              minWidth: 35,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('penaltyMinutes'),
            },
            {
              Header: 'PPG',
              id: 'powerPlayGoals',
              maxWidth: 65,
              minWidth: 40,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('ppGoals'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'SHG',
              id: 'shortHandedGoals',
              maxWidth: 65,
              minWidth: 40,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('shGoals'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'Hits',
              id: 'hits',
              maxWidth: 65,
              minWidth: 35,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('hits'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'Bks',
              id: 'blocked',
              maxWidth: 65,
              minWidth: 35,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('blockedShots'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'SOG',
              id: 'shots',
              maxWidth: 65,
              minWidth: 50,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('shots'),
              Cell: row => (
                <span>{typeof row.value === 'number' ? Number(row.value) : '-'}</span>
              ),
            },
            {
              Header: 'S%',
              id: 'shotPct',
              maxWidth: 65,
              minWidth: 50,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('shootingPctg'),
            },
            {
              Header: 'TOI/GP',
              id: 'TOIGP',
              maxWidth: 85,
              minWidth: 60,
              show: not(isGoalie(posSelected)),
              filterable: false,
              accessor: prop('timeOnIcePerGame'),
              sortMethod: sortTimeOnIce,
            },
            {
              Header: 'W',
              id: 'wins',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: propOr('-', 'wins'),
            },
            {
              Header: 'L',
              id: 'losses',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: propOr('-', 'losses'),
            },
            {
              Header: 'OT',
              id: 'ot',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: propOr('-', 'otLosses'),
            },
            {
              Header: 'Sv%',
              id: 'savePercentage',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: d => pathOr(0, ['savePercentage'], d).toFixed(3),
            },
            {
              Header: 'GAA',
              id: 'goalAgainstAverage',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: d => pathOr(0, ['goalsAgainstAverage'], d).toFixed(2),
            },
            {
              Header: 'SO',
              id: 'shutouts',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: pathOr('-', ['shutouts']),
            },
            {
              Header: 'SV',
              id: 'saves',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: propOr('-', 'saves'),
            },
            {
              Header: 'GA',
              id: 'goalsAgainst',
              maxWidth: 85,
              minWidth: 50,
              show: isGoalie(posSelected),
              filterable: false,
              accessor: propOr('-', 'goalsAgainst'),
            },
          ]}
          defaultSorted={[
            {
              id: 'points',
              desc: true,
            },
            {
              id: 'wins',
              desc: true,
            },
          ]}
          defaultPageSize={20}
          defaultSortDesc
          className="-striped player-stats"
        />
      </div>
    );
  }
}

PlayersTable.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchPlayers: PropTypes.func.isRequired,
  fetchTeams: PropTypes.func.isRequired,
};

export default PlayersTable;
