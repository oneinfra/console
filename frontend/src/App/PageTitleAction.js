import React, { Component } from 'react';

class PageTitleAction extends Component {
  render() {
    return (
        <button onClick={this.props.onClick} disabled={this.props.disabled} className={"d-none ml-2 d-sm-inline-block btn shadow-sm " + this.props.color}><i className={"fas fa-sm text-white-50 " + this.props.icon}></i> {this.props.children}</button>
    )
  }
}

export default PageTitleAction;
