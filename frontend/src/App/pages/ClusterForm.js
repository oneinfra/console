import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';

import PageTitle from "../PageTitle";
import PageTitleSubmit from "../PageTitleSubmit";

import { withLoading } from '../../lib/loading';

import { getCluster } from '../../lib/clusters';

import Api from '../../api/api';

class ClusterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusterName: '',
      kubernetesVersion: this.props.kubernetesVersions.default,
      clusterReplicas: '1',
      isEditing: props.match.params.name !== undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveCluster = this.saveCluster.bind(this);
  }

  handleChange(fieldName, event) {
    this.setState({ [fieldName]: event.target.value });
  }

  componentDidMount() {
    if (this.state.isEditing) {
      const cluster = getCluster(this.props.clusters, this.props.match.params.name);
      this.setState({
        clusterName: this.props.match.params.name,
        kubernetesVersion: cluster.spec.kubernetesVersion,
        clusterReplicas: cluster.spec.controlPlaneReplicas.toString()
      })
    }
  }

  saveCluster(event) {
    if (this.state.isEditing) {
      Api.updateCluster(
        this.state.clusterName,
        parseInt(this.state.clusterReplicas)
      )
    } else {
      Api.createCluster(
        this.state.clusterName,
        this.state.kubernetesVersion,
        parseInt(this.state.clusterReplicas),
      )
    }
    this.props.history.push(`/clusters/${this.state.clusterName}`)
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <PageTitle>{this.state.isEditing ? "Edit cluster " + this.state.clusterName : "New cluster"}</PageTitle>
          {this.state.isEditing
            ? <PageTitleSubmit onClick={this.saveCluster} color="btn-success" icon="fa-check-circle">Apply</PageTitleSubmit>
            : <PageTitleSubmit onClick={this.saveCluster} color="btn-success" icon="fa-plus-circle">Create</PageTitleSubmit>
          }
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Cluster details</h6>
              </div>
              <div className="card-body">
                <form id="new-cluster" onSubmit={this.saveCluster}>
                  <div className="form-group">
                    <label htmlFor="cluster-name">Cluster name</label>
                    <input id="cluster-name" type="text" defaultValue={this.state.clusterName} readOnly={this.state.isEditing} onChange={(event) => this.handleChange('clusterName', event)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kubernetes-version">Kubernetes version</label>
                    {this.state.isEditing
                      ? <>
                          <select readOnly value={this.state.kubernetesVersion} className="form-control" id="kubernetes-version">
                            <option>{this.state.kubernetesVersion}</option>
                          </select>
                        </>
                      : <>
                          <select value={this.state.kubernetesVersion} onChange={(event) => this.handleChange('kubernetesVersion', event)} className="form-control" id="kubernetes-version">
                            {(this.props.kubernetesVersions.versions || []).map((kubernetesVersion) => <option key={kubernetesVersion} value={kubernetesVersion}>{kubernetesVersion}{kubernetesVersion === this.props.kubernetesVersions.default ? ' (default)': ''}</option>)}
                          </select>
                        </>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cluster-replicas">Cluster replicas ({this.state.clusterReplicas} {this.state.clusterReplicas === '1' ? 'replica' : 'replicas'})</label>
                    <input id="clusterReplicas" type="range" onChange={(event) => this.handleChange('clusterReplicas', event)} value={this.state.clusterReplicas} className="form-control-range" min="1" max="7" step="2" />
                    {!this.state.isEditing &&
                      <small id="clusterReplicasHelpInline" className="alert alert-info form-text text-muted">
                        You can scale the number of replicas up or down at any time after the creation of the cluster.
                      </small>}
                  </div>
                  <button type="submit" hidden />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    clusters: state.clusters,
    kubernetesVersions: state.kubernetesVersions
  };
}

export default connect(
  mapStateToProps
)(
  withRouter(
    withLoading(
      mapStateToProps,
      (obj) => {
        if (obj.props.match.params.name !== undefined) {
          const cluster = getCluster(obj.props.clusters, obj.props.match.params.name)
          if (cluster == null) {
            return false
          }
        }
        return (obj.props.kubernetesVersions.versions !== undefined && obj.props.kubernetesVersions.versions.length > 0)
      }
    )(
      ClusterForm
    )
  )
);
