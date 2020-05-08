import React, { Component } from 'react';

import { connect } from 'react-redux';

import Loading from '../App/Loading';

export const withLoading = (mapStateToProps, loadedCondition, componentWillMountFunc, color = "secondary") => WrappedComponent => {
  const Wrapper = () => (
    class extends Component {
      render() {
        if (!loadedCondition(this)) {
          return <Loading color={color} />;
        } else {
          return <WrappedComponent {...this.props} />;
        }
      }

      componentWillMount() {
        if (componentWillMountFunc !== undefined) {
          componentWillMountFunc(this);
        }
      }
    }
  );

  return connect(mapStateToProps)(Wrapper());
}
