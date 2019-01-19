import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import SearchIcon from '../../images/search.svg';

class SearchBar extends React.Component {
  state = {
    query: '',
    results: [],
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value,
    });
  }

  render() {
    return (
      <div className="searchBar">
        <form className="searchBar-form">
          <input
            placeholder="Search For Player"
            ref={input => this.search = input}
            onChange={this.handleInputChange}
          />
          <label>
            <img src={SearchIcon} ref="Search Icon" />
          </label>
        </form>
      </div>
    );
  }
}

export default SearchBar;
