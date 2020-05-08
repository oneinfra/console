import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

export const withPolling = (pollAction, pollArguments, interval = 1000) => WrappedComponent => {
  const Wrapper = () => (
    class extends Component {
      componentDidMount() {
        if (typeof pollArguments === "function") {
          this.props.pollAction(pollArguments(this));
        } else {
          this.props.pollAction();
        }
        this.intervalId = setInterval(
          () => {
            if (typeof pollArguments === "function") {
              this.props.pollAction(pollArguments(this));
            } else {
              this.props.pollAction();
            }
          },
          interval
        );
      }

      componentWillUnmount() {
        clearInterval(this.intervalId);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
  );

  function mapDispatchToProps(dispatch) {
    return {
      pollAction: bindActionCreators(pollAction, dispatch)
    };
  }

  return connect(null, mapDispatchToProps)(Wrapper());
}
