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
                      <img src="./images/teams/small/ANA.png" />
Anaheim Ducks
                    </a>
                    <a href="/team?id=53">
                      <img src="./images/teams/small/ARI.png" />
Arizona Coyotes
                    </a>
                    <a href="/team?id=20">
                      <img src="./images/teams/small/CGY.png" />
Calgary Flames
                    </a>
                    <a href="/team?id=16">
                      <img src="./images/teams/small/CHI.png" />
Chicago Blackhawks
                    </a>
                    <a href="/team?id=21">
                      <img src="./images/teams/small/COL.png" />
Colorado Avalanche
                    </a>
                    <a href="/team?id=25">
                      <img src="./images/teams/small/DAL.png" />
Dallas Stars
                    </a>
                    <a href="/team?id=22">
                      <img src="./images/teams/small/EDM.png" />
Edmonton Oilers
                    </a>
                    <a href="/team?id=26">
                      <img src="./images/teams/small/LAK.png" />
Los Angeles Kings
                    </a>
                    <a href="/team?id=30">
                      <img src="./images/teams/small/MIN.png" />
Minnesota Wild
                    </a>
                    <a href="/team?id=18">
                      <img src="./images/teams/small/NSH.png" />
Nashville Predators
                    </a>
                    <a href="/team?id=28">
                      <img src="./images/teams/small/SJS.png" />
San Jose Sharks
                    </a>
                    <a href="/team?id=19">
                      <img src="./images/teams/small/STL.png" />
St.Louis Blues
                    </a>
                    <a href="/team?id=23">
                      <img src="./images/teams/small/VAN.png" />
Vancouver Canucks
                    </a>
                    <a href="/team?id=54">
                      <img src="./images/teams/small/VGK.png" />
Vegas Golden Knights
                    </a>
                    <a href="/team?id=52">
                      <img src="./images/teams/small/WPG.png" />
Winnipeg Jets
                    </a>
                  </div>
                  <div className="dropdownMenu-list-block">
                    <a href="/team?id=6">
                      <img src="./images/teams/small/BOS.png" />
Boston Bruins
                    </a>
                    <a href="/team?id=7">
                      <img src="./images/teams/small/BUF.png" />
Buffalo Sabres
                    </a>
                    <a href="/team?id=12">
                      <img src="./images/teams/small/CAR.png" />
Carolina Hurricanes
                    </a>
                    <a href="/team?id=29">
                      <img src="./images/teams/small/CBJ.png" />
Columbus Blue Jackets
                    </a>
                    <a href="/team?id=17">
                      <img src="./images/teams/small/DET.png" />
Detroit Red Wings
                    </a>
                    <a href="/team?id=13">
                      <img src="./images/teams/small/FLA.png" />
Florida Panthers
                    </a>
                    <a href="/team?id=8">
                      <img src="./images/teams/small/MTL.png" />
Montreal Canadiens
                    </a>
                    <a href="/team?id=1">
                      <img src="./images/teams/small/NJD.png" />
New Jersey Devils
                    </a>
                    <a href="/team?id=2">
                      <img src="./images/teams/small/NYI.png" />
New York Islanders
                    </a>
                    <a href="/team?id=3">
                      <img src="./images/teams/small/NYR.png" />
New York Rangers
                    </a>
                    <a href="/team?id=9">
                      <img src="./images/teams/small/OTT.png" />
Ottawa Senators
                    </a>
                    <a href="/team?id=4">
                      <img src="./images/teams/small/PHI.png" />
Philadelphia Flyers
                    </a>
                    <a href="/team?id=5">
                      <img src="./images/teams/small/PIT.png" />
Pittsburgh Penguins
                    </a>
                    <a href="/team?id=14">
                      <img src="./images/teams/small/TBL.png" />
Tampa Bay Lightning
                    </a>
                    <a href="/team?id=10">
                      <img src="./images/teams/small/TOR.png" />
Toronto Maple Leafs
                    </a>
                    <a href="/team?id=15">
                      <img src="./images/teams/small/WSH.png" />
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
