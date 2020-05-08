import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clusterIcon, provisionedClusters, pendingClusters, deletingClusters } from '../../lib/clusters';

import CodeQuote from "../CodeQuote";
import PageTitle from "../PageTitle";
import PageTitleAction from "../PageTitleAction";
import InformationPill from "../InformationPill";

class Clusters extends Component {
  render() {
    const { history } = this.props;
    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <PageTitle>Clusters</PageTitle>
          <PageTitleAction onClick={() => history.push("/clusters/new")} color="btn-primary" icon="fa-plus-circle">Create</PageTitleAction>
        </div>
        <div className="row">
          <InformationPill title="Total" borderColor="primary" icon="fa-equals">{this.props.clusters.length}</InformationPill>
          <InformationPill title="Provisioned" borderColor="success" icon="fa-check">{provisionedClusters(this.props.clusters).length}</InformationPill>
          <InformationPill title="Pending" borderColor="warning" icon="fa-hourglass-half">{pendingClusters(this.props.clusters).length}</InformationPill>
          <InformationPill title="Deleting" borderColor="danger" icon="fa-trash">{deletingClusters(this.props.clusters).length}</InformationPill>
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Clusters</h6>
              </div>
              <div className="card-body">
                {/* Cluster list */}
                <table className={"table" + ((this.props.clusters.length > 0) ? " table-hover" : "")}>
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Cluster Name</th>
                      <th scope="col">Kubernetes Version</th>
                      <th scope="col">Control Plane Replicas</th>
                      <th scope="col">Join Tokens</th>
                      <th scope="col">VPN</th>
                      <th scope="col">VPN CIDR</th>
                      <th scope="col">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.clusters.length > 0
                     ? this.props.clusters.map((cluster, index) => (
                         <tr key={cluster.metadata.name}>
                           <td className="text-center align-middle"><i className={"fas fa-2x text-primary " + clusterIcon(cluster)} /></td>
                           <td className="align-middle"><Link to={"/clusters/" + cluster.metadata.name}>{cluster.metadata.name}</Link></td>
                           <td className="align-middle"><CodeQuote>{cluster.spec.kubernetesVersion}</CodeQuote></td>
                           <td className="align-middle">{cluster.spec.controlPlaneReplicas}</td>
                           <td className="align-middle">{cluster.spec.joinTokens === undefined ? 0 : cluster.spec.joinTokens.length}</td>
                           <td className="align-middle">{(cluster.spec.vpn && cluster.spec.vpn.enabled) ? 'Yes' : 'No'}</td>
                           <td className="align-middle">{(cluster.spec.vpn && cluster.spec.vpn.enabled) ? cluster.spec.vpn.CIDR : 'Not applicable'}</td>
                           <td className="align-middle">{cluster.metadata.creationTimestamp}</td>
                         </tr>))
                     : <tr>
                         <td className="text-center" colSpan="42">
                           <p className="p-2">You haven't created any clusters yet. <Link className="btn btn-primary shadow-sm" to="/clusters/new"><i className="fas fa-sm text-white-50 fa-plus-circle"></i> Create</Link> a new cluster.</p>
                         </td>
                       </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps)(withRouter(Clusters));
