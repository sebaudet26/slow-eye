import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {
  filter, map, pipe, prop, take, mapObjIndexed, values,
} from 'ramda';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import SearchIcon from '../../public/images/search.svg';
import PlayerIcon from '../PlayerIcon';
import { smallLogoForTeamName } from '../../utils/team';

let action;
const debounce = (func, delay) => {
  if (action) {
    clearTimeout(action);
  }
  action = setTimeout(func, delay);
};

const optionsQuery = gql`
  query {
    nhl {
      players (season: "all") {
        id
        name
      }
      teams (season:"20182019") {
        id
        name
        abbreviation
      }
    }
  }`

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

const stringMatches = query => opt => new RegExp(query, 'i').test(opt.string);

const initialState = {
  cursor: 0,
  query: '',
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: 0,
      query: '',
      showOptions: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.closeOptions = this.closeOptions.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(action);
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    debounce(() => this.setState({ query: newValue }), 200);

    this.setState({ showOptions: true });
  }

  handleClick(e) {
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

  showOptions(e) {
    event.target.select();
    event.preventDefault();

    this.setState({ showOptions: true }, () => {
      document.addEventListener('click', this.closeOptions);
    });
  }

  closeOptions(e) {
    if (!this.optionsList.contains(event.target)) {
      this.setState({ showOptions: false }, () => {
        document.removeEventListener('click', this.closeOptions);
      });
    }
  }

  render() {
    const { query, cursor } = this.state;

    return (
      <div className="searchBar">
        <form className="searchBar-form">
          <label>
            <img src={SearchIcon} alt="" />
          </label>
          <input
            placeholder="Search For Player or Team"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onClick={this.showOptions}
          />
          <Query query={optionsQuery}>
            {({ loading, error, data }) => {
              if (loading) return (null);
              if (error) return ('Error');
              const { players = [], teams = [] } = data.nhl

              const options = [
                ...players.map(p => ({
                  id: p.id, string: p.name, linkType: 'player',
                })),
                ...teams.map(t => ({
                  id: t.id, string: t.name, linkType: 'team', abbreviation: t.abbreviation,
                })),
              ];

              return (
                <div>
                  {
                    this.state.showOptions && (
                      <div className="options" ref={(element) => { this.optionsList = element; }}>
                      {query ? pipe(filter(stringMatches(query)), take(5), mapObjIndexed(renderOption(cursor)), values)(options) : null}
                      </div>
                    )
                  }
                </div>
              );
            }}
          </Query>
        </form>
      </div>
    );
  }
}

export default SearchBar;
