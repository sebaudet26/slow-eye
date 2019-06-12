import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './style.scss';

class HeaderDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  onMouseEnter() {
    this.setState({ dropdownOpen: true });
  }

  onMouseLeave() {
    this.setState({ dropdownOpen: false });
  }

  render() {
    const subMenu = this.props.list;

    return (
      <div className="header-nav-item headerDropdownMenu" onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} toggle={this.toggle}>
        <div className="">
          {this.props.name}
          <i className="headerDropdownMenu-arrow" />
        </div>
        {
        this.state.dropdownOpen
          ? (
            <div className="headerDropdownMenu-list">
              {subMenu.map((value, index) => <NavLink to={value.link} key={index}>{value.name}</NavLink>)}
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default HeaderDropdown;
