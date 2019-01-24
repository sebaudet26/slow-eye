import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {
  filter, map, pipe, take,
} from 'ramda';
import SearchIcon from '../../images/search.svg';
import PlayerIcon from '../PlayerIcon';
import graphqlApi from '../../utils/api';
import { smallLogoForTeamName } from '../../utils/team';

let action;
const debounce = (func, delay) => {
  if (action) {
    clearTimeout(action);
  }
  action = setTimeout(func, delay);
};

const graphqlQueryPlayers = `{
  allHistoryPlayers {
    id
    name
  }
}`;

const graphqlQueryTeams = `{
  teams {
    id
    name
    abbreviation
  }
}`;

const renderOption = opt => (
  <a
    href={`/${opt.linkType}?id=${opt.id}`}
    className="options-item"
  >
    {
      opt.linkType === 'player'
        ? (
          <PlayerIcon id={opt.id} />
        ) : (
          <img
            className="options-img team"
            src={smallLogoForTeamName(opt.abbreviation)}
            alt=""
          />
        )
    }
    {opt.string}
  </a>
);

const stringMatches =
  query => opt => new RegExp(query, 'i').test(opt.string);

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      query: '',
    };
    this.getPlayersShortList = this.getPlayersShortList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.getPlayersShortList();
  }

  componentWillReceiveProps() {

  }

  async getPlayersShortList() {
    const { allHistoryPlayers: players } = await graphqlApi(graphqlQueryPlayers);
    const { teams } = await graphqlApi(graphqlQueryTeams);
    const newOptions = [
      ...players.map(p => ({
        id: p.id, string: p.name, linkType: 'player',
      })),
      ...teams.map(t => ({
        id: t.id, string: t.name, linkType: 'team', abbreviation: t.abbreviation,
      })),
    ];
    this.setState({ options: newOptions });
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    debounce(() => this.setState({ query: newValue }), 200);
  }

  render() {
    const { options, query } = this.state;
    return (
      <div className="searchBar">
        <form className="searchBar-form">
          <input
            placeholder="Search For Player"
            onChange={this.handleInputChange}
          />
          <label>
            <img src={SearchIcon} alt="" />
          </label>
          <div className="options">
            {
              query ?
                pipe(
                  filter(stringMatches(query)),
                  take(5),
                  map(renderOption),
                )(options)
                : null
            }
          </div>
        </form>

      </div>
    );
  }
}

export default SearchBar;
