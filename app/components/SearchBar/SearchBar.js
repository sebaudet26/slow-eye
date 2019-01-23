import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {
  filter, map, pipe, take,
} from 'ramda';
import SearchIcon from '../../images/search.svg';
import graphqlApi from '../../utils/api';

const graphqlQuery = `{
  players {
    id
    person {
      fullName
    }
  }
}`;

const renderPlayerOption = p => (
  <a
    href={`/player?id=${p.id}`}
    className="option"
  >
    {p.person.fullName}
  </a>
);

const playerNameMatches =
  query => p => new RegExp(query, 'i').test(p.person.fullName);

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
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
    const { players } = await graphqlApi(graphqlQuery);
    this.setState({ players });
  }

  handleInputChange() {
    this.setState({
      query: this.search.value,
    });
  }

  render() {
    const { players, query } = this.state;
    console.log('players in the header', players);
    return (
      <div className="searchBar">
        <form className="searchBar-form">
          <input
            placeholder="Search For Player"
            ref={input => this.search = input}
            onChange={this.handleInputChange}
          />
          <label>
            <img src={SearchIcon} ref="Search Icon" alt="" />
          </label>
        </form>
        {
          query ?
            pipe(
              filter(playerNameMatches(query)),
              take(10),
              map(renderPlayerOption),
            )(players)
            : null
        }
      </div>
    );
  }
}

export default SearchBar;
