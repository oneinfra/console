import React, { Component } from 'react';
import md5 from 'md5';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { logoutUser } from '../actions/userActions';

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-600">{this.props.user}</span>
              <img className="img-profile rounded-circle" src={'//www.gravatar.com/avatar/' + md5(this.props.user)}/>
            </a>
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
              <Link className="dropdown-item" to="/">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Dashboard
              </Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={this.props.logoutUser}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: bindActionCreators(logoutUser, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Header);
