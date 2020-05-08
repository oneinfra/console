import React, { Component } from 'react';

class PageTitle extends Component {
  render() {
    return (
        <h1 className="h3 mr-auto mb-0 text-gray-800">{this.props.children}</h1>
    )
  }
}

export default PageTitle;
