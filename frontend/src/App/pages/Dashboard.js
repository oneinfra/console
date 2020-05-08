import React, { Component } from 'react';
import { connect } from 'react-redux';

import InformationPill from "../InformationPill"

class Dashboard extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        </div>
        <div className="row">
          <InformationPill title="Clusters" borderColor="primary" icon="fa-clone">{this.props.clusters.length}</InformationPill>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
     clusters: state.clusters
  };
}

export default connect(mapStateToProps)(Dashboard);
