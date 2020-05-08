import React, { Component } from 'react';

class InformationPill extends Component {
  render() {
    return (
      <div className={this.props.size || "col-xl-3 col-md-6 mb-4"}>
        <div className={"card shadow h-100 py-2 border-left-" + this.props.borderColor}>
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{this.props.title}</div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{this.props.children}</div>
              </div>
              <div className="col-auto">
                <i className={"fas fa-2x text-gray-300 " + this.props.icon}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InformationPill;
