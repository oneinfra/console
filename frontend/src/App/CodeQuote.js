import React, { Component } from 'react';

class CodeQuote extends Component {
  render() {
    return (
        <span className="text-monospace p-1 badge badge-secondary">{this.props.children}</span>
    )
  }
}

export default CodeQuote;
