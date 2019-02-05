import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {
  filter, map, pipe, prop, take, mapObjIndexed, values,
} from 'ramda';
import { push } from 'react-router-redux';
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

const renderOption = cursor => (opt, i) => (
  <a
    id={`option-${i}`}
    key={`option-${i}`}
    href={`/${opt.linkType}?id=${opt.id}`}
    className={`options-item${cursor == i ? ' active' : ''}`}
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
      cursor: 0,
      options: [],
      query: '',
    };
    this.getPlayersShortList = this.getPlayersShortList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.getPlayersShortList();
  }

  componentWillUnmount() {
    clearTimeout(action);
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

  handleFocus(e) {
    event.target.select();
  }

  handleKeyDown(e) {
    const { cursor, options, query } = this.state;
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      this.setState(prevState => ({
        cursor: prevState.cursor - 1,
      }));
    } else if (e.keyCode === 40 && cursor < 5) {
      this.setState(prevState => ({
        cursor: prevState.cursor + 1,
      }));
    } else if (e.keyCode == 13) {
      document.getElementById(`option-${cursor}`).click();
      event.preventDefault();
    }
  }

  render() {
    const { options, query, cursor } = this.state;
    return (
      <div className="searchBar">
        <form className="searchBar-form">
          <input
            placeholder="Search For Player"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
          />
          <label>
            <img src={SearchIcon} alt="" />
          </label>
          <div className="options">
            {
              query
                ? pipe(
                  filter(stringMatches(query)),
                  take(5),
                  mapObjIndexed(renderOption(cursor)),
                  values,
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
