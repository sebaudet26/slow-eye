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
      <div className="dropdown">
        <div className="dropdown-trigger" onClick={this.showMenu}>
          <h2>{this.props.name}</h2>
          <div>
            <i className="dropdown-arrow" />
          </div>
        </div>

        {
          this.state.showMenu
            ? (
              <div
                className="dropdown-menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                <div className="dropdown-menu-list">
                  <a href="/team?id=24">Anaheim Ducks</a>
                  <a href="/team?id=53">Arizona Coyotes</a>
                  <a href="/team?id=6">Boston Bruins</a>
                  <a href="/team?id=7">Buffalo Sabres</a>
                  <a href="/team?id=20">Calgary Flames</a>
                  <a href="/team?id=12">Carolina Hurricanes</a>
                  <a href="/team?id=16">Chicago Blackhawks</a>
                  <a href="/team?id=21">Colorado Avalanche</a>
                  <a href="/team?id=29">Columbus Blue Jackets</a>
                  <a href="/team?id=25">Dallas Stars</a>
                  <a href="/team?id=17">Detroit Red Wings</a>
                  <a href="/team?id=22">Edmonton Oilers</a>
                  <a href="/team?id=13">Florida Panthers</a>
                  <a href="/team?id=26">Los Angeles Kings</a>
                  <a href="/team?id=30">Minnesota Wild</a>
                  <a href="/team?id=8">Montreal Canadiens</a>
                  <a href="/team?id=18">Nashville Predators</a>
                  <a href="/team?id=1">New Jersey Devils</a>
                  <a href="/team?id=2">New York Islanders</a>
                  <a href="/team?id=3">New York Rangers</a>
                  <a href="/team?id=9">Ottawa Senators</a>
                  <a href="/team?id=4">Philadelphia Flyers</a>
                  <a href="/team?id=5">Pittsburgh Penguins</a>
                  <a href="/team?id=28">San Jose Sharks</a>
                  <a href="/team?id=19">St.Louis Blues</a>
                  <a href="/team?id=14">Tampa Bay Lightning</a>
                  <a href="/team?id=10">Toronto Maple Leafs</a>
                  <a href="/team?id=23">Vancouver Canucks</a>
                  <a href="/team?id=54">Vegas Golden Knights</a>
                  <a href="/team?id=15">Washington Capitals</a>
                  <a href="/team?id=52">Winnipeg Jets</a>
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
