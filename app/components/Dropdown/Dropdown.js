import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import './style.scss';

const teamsQuery = gql`
query {
  teams {
    id
    name
    ranking {
      conferenceName
    }
  }
}`;

class Dropdown extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  render() {
    return (
      <div className="dropdownMenu">
        <div className="dropdownMenu-trigger" onClick={this.showMenu}>
          <h2>{this.props.name}</h2>
          <div>
            <i className="dropdownMenu-arrow" />
          </div>
        </div>
        {
            this.state.showMenu
              ? (
                <div
                  className="dropdownMenu-list"
                  ref={(element) => {
                    this.dropdownMenu = element;
                  }}
                >
                  <div className="dropdownMenu-list-wrapper">
                    <div className="dropdownMenu-list-block">
                      <Query query={teamsQuery}>
                        {({ loading, error, data }) => {
                          if (loading) return (null);
                          if (error) return ('Error');

                          const teams = data.teams;

                          return teams.map(team => (
                            <a key={team.id} href={`/team?id=${team.id}`}>
                              <svg>
                                <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
                              </svg>
                              {team.name}
                            </a>
                          ));
                        }}
                      </Query>
                    </div>
                  </div>
                </div>
              )
              : (
                null
              )
          }
      </div>
    );
  }
}

export default Dropdown;
