import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadUser } from '../actions/userActions';

import { withLoading } from '../lib/loading';

import App from './App';
import Auth from './Auth';

class AppOrAuth extends Component {
  render() {
    return (
      this.props.user !== null
        ? <App />
        : <Auth />
    )
  }
}

function mapStateToProps(state, props) {
  return {
    initialized: state.initialized,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadUser: bindActionCreators(loadUser, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withLoading(
    mapStateToProps,
    (obj) => obj.props.initialized,
    (obj) => obj.props.loadUser(),
    "white"
  )(AppOrAuth)
);
