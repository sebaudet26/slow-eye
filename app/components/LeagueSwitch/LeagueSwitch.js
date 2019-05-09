import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';
import NHLLogo from './images/nhl.svg';
import MLBLogo from './images/mlb.svg';

class LeagueSwitch extends React.Component {
  constructor() {
    super();

    this.state = {
      showOptions: false,
    };

    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      showOptions: !prevState.showOptions,
    }));
  }

  onMouseEnter() {
    this.setState({ showOptions: true });
  }

  onMouseLeave() {
    this.setState({ showOptions: false });
  }

  render() {
    return (
      <div className="leagueSwitch" onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} toggle={this.toggle}>
        <div className="leagueSwitch-select">
          {this.props.league}
          <i className="leagueSwitch-arrow" />
        </div>
        {
        this.state.showOptions
          ? (
            <div className="leagueSwitch-list">
              <Link to="/" data-id="NHL" onClick={this.props.switchLeague} className="leagueSwitch-list-item">
                <div className="leagueSwitch-img-wrapper">
                  <img src={NHLLogo} />
                </div>
                NHL

              </Link>
              <Link to="/mlb/standings" data-id="MLB" onClick={this.props.switchLeague} className="leagueSwitch-list-item">
                <div className="leagueSwitch-img-wrapper">
                  <img src={MLBLogo} />
                </div>
                MLB
              </Link>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default LeagueSwitch;
