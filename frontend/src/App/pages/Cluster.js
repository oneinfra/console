import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';

import { withPolling } from '../../lib/polling';
import { withLoading } from '../../lib/loading';

import { loadComponents } from '../../actions/componentActions';
import { clusterStatus } from '../../lib/clusters';
import { copyToClipboard } from '../../lib/clipboard';

import CodeQuote from "../CodeQuote";
import PageTitle from "../PageTitle";
import PageTitleAction from "../PageTitleAction";
import InformationPill from "../InformationPill";
import Modal from "../Modal";
import Components from "./Components";
import Conditions from "./Conditions";
import ClusterJoinTokens from "./ClusterJoinTokens";
import StorageEndpoints from "./StorageEndpoints";

import { getCluster } from '../../lib/clusters';

import Api from '../../api/api';

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = { wantsToDelete: false };
    this.copyCACertificateToClipboard = this.copyCACertificateToClipboard.bind(this);
    this.downloadKubeconfig = this.downloadKubeconfig.bind(this);
    this.confirmDeleteCluster = this.confirmDeleteCluster.bind(this);
    this.dismissDeleteCluster = this.dismissDeleteCluster.bind(this);
    this.deleteCluster = this.deleteCluster.bind(this);
  }

  copyCACertificateToClipboard() {
    const cluster = getCluster(this.props.clusters, this.props.match.params.name);
    copyToClipboard(cluster.spec.apiServer.ca.certificate);
  }

  downloadKubeconfig() {
    window.location.href = `/api/clusters/${this.props.match.params.name}/kubeconfig`;
  }

  confirmDeleteCluster() {
    this.setState({ wantsToDelete: true });
  }

  dismissDeleteCluster() {
    this.setState({ wantsToDelete: false });
  }

  deleteCluster() {
    Api.deleteCluster(
      this.props.match.params.name
    )
    this.props.history.push('/clusters')
  }

  render() {
    const cluster = getCluster(this.props.clusters, this.props.match.params.name);
    const components = this.props.clusterComponents[this.props.match.params.name] || [];
    const conditions = cluster.status.conditions || [];
    const desiredJoinTokens = cluster.spec.joinTokens || [];
    const currentJoinTokens = cluster.status.joinTokens || [];
    const caCertificateName = `${cluster.metadata.namespace}-${cluster.metadata.name}-ca.crt`
    const downloadCACommand = `kubectl get cluster ${cluster.metadata.name} -n ${cluster.metadata.namespace} -o json | jq -jr .spec.apiServer.ca.certificate`;
    return (
      <>
        {this.state.wantsToDelete &&
         <Modal yesTitle="Yes, delete it" yesColor="danger" yesAction={this.deleteCluster} noTitle="Cancel" noColor="primary" noAction={this.dismissDeleteCluster} title="Do you really want to delete this cluster?">
           <p>By confirming this action,  your cluster "{this.props.match.params.name}" will be deleted.</p>
           <p>This operation cannot be undone.</p>
         </Modal>
        }
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <PageTitle>Cluster {this.props.match.params.name}</PageTitle>
            <PageTitleAction onClick={this.downloadKubeconfig} color="btn-primary" icon="fa-download" disabled={cluster.status.apiServerEndpoint === undefined}>Download kubeconfig</PageTitleAction>
            <PageTitleAction onClick={() => this.props.history.push(`/clusters/${this.props.match.params.name}/edit`)} color="btn-primary" icon="fa-edit">Edit</PageTitleAction>
            <PageTitleAction onClick={this.confirmDeleteCluster} color="btn-danger" icon="fa-trash">Delete</PageTitleAction>
          </div>
          <div className="row">
            <InformationPill title="Status" borderColor="primary" icon="fa-info">{clusterStatus(cluster)}</InformationPill>
            <InformationPill title="Kubernetes version" borderColor="primary" icon="fa-code-branch">{cluster.spec.kubernetesVersion}</InformationPill>
            <InformationPill title="Replicas" borderColor="primary" icon="fa-clone">{cluster.spec.controlPlaneReplicas}</InformationPill>
            <InformationPill title="Created" borderColor="primary" icon="fa-calendar">{cluster.metadata.creationTimestamp}</InformationPill>
          </div>
          <div className="row">
            <InformationPill title="VPN" borderColor="primary" icon="fa-lock">{cluster.spec.vpn.enabled ? "Yes" : "No"}</InformationPill>
            <InformationPill title="VPN CIDR" borderColor="primary" icon="fa-network-wired">{cluster.spec.vpn.CIDR || "Not applicable"}</InformationPill>
            <InformationPill title="API Server Endpoint" borderColor="primary" icon="fa-link" size="col-xl-6 col-md-12 mb-4">{cluster.status.apiServerEndpoint || "Not published yet"}</InformationPill>
          </div>
          <div className="row">
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Conditions</h6>
                </div>
                <div className="card-body">
                  <Conditions conditions={conditions} />
                </div>
              </div>
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Components</h6>
                </div>
                <div className="card-body">
                  <Components components={components} />
                </div>
              </div>
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="mr-auto m-0 font-weight-bold text-primary">Joining worker nodes</h6>
                  <a onClick={this.copyCACertificateToClipboard} className="d-none ml-2 d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-clipboard fa-sm text-white-50"></i> Copy API server CA certificate to the clipboard</a>
                </div>
                <div className="card-body">
                  <p>In order to join a worker node to your cluster, the machine to be joined has to fulfill the following requirements:</p>
                  <ul>
                    <li>A container runtime installed (e.g. containerd, cri-o...); any container runtime that implements the Container Runtime Interface (CRI) will suffice.</li>
                    <li>
                      <p>The CA certificate of the API server needs to be in the filesystem of the node to be joined, so it can validate the API server identity upon join. You can copy the CA certificate contents on your browser by clicking on the button above, or you can use <CodeQuote>kubectl</CodeQuote> pointing to the management cluster to download it:</p>
                      <pre className="mt-2 ml-4 pl-4 border-left-secondary">{downloadCACommand}</pre>
                    </li>
                  </ul>
                  {currentJoinTokens.length > 0 &&
                     <>
                       <p>Join commands for each current join token:</p>
                       <ul>
                       {currentJoinTokens.map((joinToken) => {
                         const joinCommand = `oi node join --nodename <nodename> \\
               --apiserver-endpoint ${cluster.status.apiServerEndpoint} \\
               --apiserver-ca-cert-file /path/to/ca/cert/${caCertificateName} \\
               --join-token ${joinToken}`;
                         return <><li>With join token <CodeQuote>{joinToken}</CodeQuote>:</li><pre className="mt-2 ml-4 pl-4 border-left-secondary">{joinCommand}</pre></> })}
                       </ul>
                       <p>Please, refer to the command <CodeQuote>oi node join --help</CodeQuote> for further information.</p>
                     </>}
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5">
              <ClusterJoinTokens clusterName={cluster.metadata.name} desiredJoinTokens={desiredJoinTokens} currentJoinTokens={currentJoinTokens} />
              <StorageEndpoints storagePeerEndpoints={cluster.status.storagePeerEndpoints} storageClientEndpoints={cluster.status.storageClientEndpoints} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    clusters: state.clusters,
    clusterComponents: state.clusterComponents
  };
}

export default connect(
  mapStateToProps
)(
  withRouter(
    withPolling(
      loadComponents,
      (obj) => obj.props.match.params.name
    )(
      withLoading(
        mapStateToProps,
        (obj) => getCluster(obj.props.clusters, obj.props.match.params.name) != null,
      )(
        Cluster
      )
    )
  )
);
