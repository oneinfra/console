import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { NavLink } from 'react-router-dom';

import { logoutUser } from '../actions/userActions';

class Sidebar extends Component {
  render() {
    return (
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <div className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-text mx-3">oneinfra</div>
          <div className="sidebar-brand-text-short mx-3">OI</div>
        </div>

        <li className="nav-item">
          <NavLink exact className="nav-link" activeClassName="active" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <div className="sidebar-heading">
          Resources
        </div>
        <li className="nav-item">
          <NavLink className="nav-link" to="/clusters">
            <i className="fas fa-fw fa-clone"></i>
            <span>Clusters</span>
          </NavLink>
        </li>

        <div className="sidebar-heading">
          Session
        </div>
        <li className="nav-item">
          <a onClick={this.props.logoutUser} className="nav-link">
            <i className="fas fa-fw fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </li>

      </ul>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: bindActionCreators(logoutUser, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Sidebar);
