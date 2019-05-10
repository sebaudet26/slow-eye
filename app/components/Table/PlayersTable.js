/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Select from 'react-select';
import {
  any,
  find,
  findIndex,
  isNil,
  last,
  length,
  map,
  match,
  not,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  reject,
  replace,
  split,
  toLower,
  toString,
} from 'ramda';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table/react-table.css';
import PlayerName from '../PlayerName';
import TeamLogo from '../TeamLogo';
import NationalityFilter from '../Filter/nationality';
import ExperienceFilter from '../Filter/experience';
import SeasonFilter from '../Filter/season';
import PositionFilter from '../Filter/position';
import TeamFilter from '../Filter/team';
import { sortTimeOnIce } from '../../utils/sort';
import { toLowerCaseAndMatch } from '../../utils/filter';
import { isPosGoalie } from '../../utils/player';
import { saveToLS, getFromLS } from '../../utils/localStorage';
import seasons from '../../constants/seasons';
import FilterIcon from './images/filter.svg';
import './styles.scss';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

// Team Dropdown Options
const baseTeamOptions = [
  { value: '', label: 'All Teams' },
];

class PlayersTable extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      seasonSelected: '20182019',
      posSelected: 'S',
      natSelected: '',
      teamSelected: '',
      XPSelected: '',
      ...JSON.parse(getFromLS('playersFilters') || '{}'),
    };
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleNatChange = this.handleNatChange.bind(this);
    this.handleXPChange = this.handleXPChange.bind(this);
  }

  componentDidMount() {
    const { seasonSelected } = this.state;
    const { fetchPlayers, fetchTeams, setLoading } = this.props;
    setLoading();
    fetchPlayers(seasonSelected || seasons[0].value);
    fetchTeams(seasonSelected || seasons[0].value);
  }

  componentDidUpdate() {
    saveToLS('playersFilters', JSON.stringify(this.state));
  }

  handleSeasonChange(target) {
    const { fetchPlayers, fetchTeams, setLoading } = this.props;
    this.setState({
      seasonSelected: target.value,
    });
    setLoading();
    fetchPlayers(target.value);
    fetchTeams(target.value);
  }

  componentWillUpdate(newProps) {
    const { teamSelected } = this.state;
    if (newProps.teams && teamSelected.length) {
      if (findIndex(propEq('abbreviation', teamSelected))(newProps.teams) < 0) {
        return this.setState({ teamSelected: baseTeamOptions[0].value });
      }
    }
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
    const { players, teams, loading } = this.props;
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
          <div className="container">
            <div className="filters-wrapper">
              <SeasonFilter selected={seasonSelected} onChange={this.handleSeasonChange} />
              <PositionFilter selected={posSelected} onChange={this.handlePosChange} />
              <TeamFilter options={teamOptions} selected={teamSelected} onChange={this.handleTeamChange} />
              <NationalityFilter selected={natSelected} onChange={this.handleNatChange} />
              <ExperienceFilter selected={XPSelected} onChange={this.handleXPChange} />
            </div>
          </div>
        </div>
        <div className="container">
          <ReactTableFixedColumns
            filtered={[
              {
                id: 'position',
                value: posSelected,
              },
              {
                id: 'team',
                value: teamSelected,
              },
              {
                id: 'nationality',
                value: natSelected,
              },
              {
                id: 'experience',
                value: XPSelected,
              },
            ]}
            data={players}
            loading={loading}
            resizable={false}
            noDataText="No players match the criteria"
            filterable
            defaultFilterMethod={toLowerCaseAndMatch}
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
                minWidth: 110,
                fixed: 'left',
                Cell: row => <PlayerName id={row.original.id} name={row.value} />,
              },
              {
                Header: 'Pos',
                id: 'position',
                className: 'text-left hidden-mobile',
                maxWidth: 50,
                minWidth: 50,
                fixed: 'left',
                accessor: (d) => {
                  const pos = prop('positionCode', d);
                  if (['L', 'R'].includes(pos)) {
                    return `${pos}W`;
                  }
                  return pos;
                },
                filterMethod: (filter, row) => {
                  if (filter.value === 'S') {
                    return row[filter.id] !== 'G';
                  }
                  if (filter.value === 'F') {
                    return row[filter.id] === 'C' || row[filter.id] === 'LW' || row[filter.id] === 'RW';
                  }
                  return toLowerCaseAndMatch(filter, row);
                },
              },
              {
                Header: 'Team',
                id: 'team',
                className: 'text-left team-cell sm-margin hidden-mobile',
                maxWidth: 85,
                minWidth: 75,
                fixed: 'left',
                Cell: pipe(
                  prop('value'),
                  map(prop('id')),
                  map(id => <TeamLogo key={id} teamId={id} season={seasonSelected} />),
                ),
                accessor: prop('teams'),
                filterMethod: (filter, row) => pipe(
                  prop(filter.id),
                  reject(isNil),
                  last,
                  propOr('', 'abbreviation'),
                  toLower,
                  replace(/\s/g, ''),
                  pipe(match(toLower(filter.value)), length, Boolean),
                )(row),
              },
              {
                Header: 'Nat.',
                id: 'nationality',
                className: 'text-left team-cell hidden',
                maxWidth: 85,
                minWidth: 50,
                accessor: prop('nationality'),
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
                minWidth: 33,
                filterable: false,
                accessor: prop('gamesPlayed'),
              },
              {
                Header: 'G',
                id: 'goals',
                maxWidth: 65,
                minWidth: 33,
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('goals'),
              },
              {
                Header: 'A',
                id: 'assists',
                maxWidth: 65,
                minWidth: 33,
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('assists'),
              },
              {
                Header: 'Pts',
                id: 'points',
                maxWidth: 65,
                minWidth: 40,
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('points'),
              },
              {
                Header: '+/-',
                id: 'plusMinus',
                maxWidth: 65,
                minWidth: 40,
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('penaltyMinutes'),
              },
              {
                Header: 'PPG',
                id: 'powerPlayGoals',
                maxWidth: 65,
                minWidth: 40,
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
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
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('shootingPctg'),
              },
              {
                Header: 'TOI/GP',
                id: 'TOIGP',
                maxWidth: 85,
                minWidth: 60,
                show: not(isPosGoalie(posSelected)),
                filterable: false,
                accessor: prop('timeOnIcePerGame'),
                sortMethod: sortTimeOnIce,
              },
              {
                Header: 'W',
                id: 'wins',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: propOr('-', 'wins'),
              },
              {
                Header: 'L',
                id: 'losses',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: propOr('-', 'losses'),
              },
              {
                Header: 'OT',
                id: 'ot',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: propOr('-', 'otLosses'),
              },
              {
                Header: 'Sv%',
                id: 'savePercentage',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: d => pathOr(0, ['savePercentage'], d).toFixed(3),
              },
              {
                Header: 'GAA',
                id: 'goalAgainstAverage',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: d => pathOr(0, ['goalsAgainstAverage'], d).toFixed(2),
                sortMethod: (a, b) => (a > b ? -1 : 1),
              },
              {
                Header: 'SO',
                id: 'shutouts',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: pathOr('-', ['shutouts']),
              },
              {
                Header: 'SV',
                id: 'saves',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
                filterable: false,
                accessor: propOr('-', 'saves'),
              },
              {
                Header: 'GA',
                id: 'goalsAgainst',
                maxWidth: 85,
                minWidth: 50,
                show: isPosGoalie(posSelected),
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
            className="player-stats"
          />
        </div>
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
