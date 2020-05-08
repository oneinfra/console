import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="full-screen-spinner">
        <div className="sk-chase-wrapper">
          <div className="sk-chase">
            <div className={"sk-chase-dot " + this.props.color}></div>
            <div className={"sk-chase-dot " + this.props.color}></div>
            <div className={"sk-chase-dot " + this.props.color}></div>
            <div className={"sk-chase-dot " + this.props.color}></div>
            <div className={"sk-chase-dot " + this.props.color}></div>
            <div className={"sk-chase-dot " + this.props.color}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Loading;
