import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';

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
                    <a href="/team?id=24">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-24-20182019-light" />
                      </svg>
Anaheim Ducks
                    </a>
                    <a href="/team?id=53">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-53-20182019-light" />
                      </svg>
Arizona Coyotes
                    </a>
                    <a href="/team?id=20">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-20-20182019-light" />
                      </svg>
Calgary Flames
                    </a>
                    <a href="/team?id=16">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-16-20182019-light" />
                      </svg>
Chicago Blackhawks
                    </a>
                    <a href="/team?id=21">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-21-20182019-light" />
                      </svg>
Colorado Avalanche
                    </a>
                    <a href="/team?id=25">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-25-20182019-light" />
                      </svg>
Dallas Stars
                    </a>
                    <a href="/team?id=22">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-22-20182019-light" />
                      </svg>
Edmonton Oilers
                    </a>
                    <a href="/team?id=26">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-26-20182019-light" />
                      </svg>
Los Angeles Kings
                    </a>
                    <a href="/team?id=30">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-30-20182019-light" />
                      </svg>
Minnesota Wild
                    </a>
                    <a href="/team?id=18">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-18-20182019-light" />
                      </svg>
Nashville Predators
                    </a>
                    <a href="/team?id=28">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-28-20182019-light" />
                      </svg>
San Jose Sharks
                    </a>
                    <a href="/team?id=19">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-19-20182019-light" />
                      </svg>
St.Louis Blues
                    </a>
                    <a href="/team?id=23">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-23-20182019-light" />
                      </svg>
Vancouver Canucks
                    </a>
                    <a href="/team?id=54">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-54-20182019-light" />
                      </svg>
Vegas Golden Knights
                    </a>
                    <a href="/team?id=52">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-52-20182019-light" />
                      </svg>
Winnipeg Jets
                    </a>
                  </div>
                  <div className="dropdownMenu-list-block">
                    <a href="/team?id=6">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-6-20182019-light" />
                      </svg>
Boston Bruins
                    </a>
                    <a href="/team?id=7">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-7-20182019-light" />
                      </svg>
Buffalo Sabres
                    </a>
                    <a href="/team?id=12">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-12-20182019-light" />
                      </svg>
Carolina Hurricanes
                    </a>
                    <a href="/team?id=29">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-29-20182019-light" />
                      </svg>
Columbus Blue Jackets
                    </a>
                    <a href="/team?id=17">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-17-20182019-light" />
                      </svg>
Detroit Red Wings
                    </a>
                    <a href="/team?id=13">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-13-20182019-light" />
                      </svg>
Florida Panthers
                    </a>
                    <a href="/team?id=8">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-8-20182019-light" />
                      </svg>
Montreal Canadiens
                    </a>
                    <a href="/team?id=1">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-1-20182019-light" />
                      </svg>
New Jersey Devils
                    </a>
                    <a href="/team?id=2">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-2-20182019-light" />
                      </svg>
New York Islanders
                    </a>
                    <a href="/team?id=3">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-3-20182019-light" />
                      </svg>
New York Rangers
                    </a>
                    <a href="/team?id=9">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-9-20182019-light" />
                      </svg>
Ottawa Senators
                    </a>
                    <a href="/team?id=4">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-4-20182019-light" />
                      </svg>
Philadelphia Flyers
                    </a>
                    <a href="/team?id=5">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-5-20182019-light" />
                      </svg>
Pittsburgh Penguins
                    </a>
                    <a href="/team?id=14">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-14-20182019-light" />
                      </svg>
Tampa Bay Lightning
                    </a>
                    <a href="/team?id=10">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-10-20182019-light" />
                      </svg>
Toronto Maple Leafs
                    </a>
                    <a href="/team?id=15">
                      <svg>
                        <use xlinkHref="/images/teams/season/20182019.svg#team-15-20182019-light" />
                      </svg>
Washington Capitals
                    </a>
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
