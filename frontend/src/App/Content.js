import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Route,
  Switch,
} from 'react-router-dom';

import Header from './Header';
import Dashboard from './pages/Dashboard';
import Clusters from './pages/Clusters';
import Cluster from './pages/Cluster';
import ClusterForm from './pages/ClusterForm';
import NotFound from './pages/NotFound';

class Content extends Component {
  render() {
    return (
      <div id="content">
        <Header user={this.props.user} />
        <Switch>
          <Route exact path="/clusters" component={Clusters} />
          <Route exact path="/clusters/new" component={ClusterForm} />
          <Route exact path="/clusters/:name" component={Cluster} />
          <Route exact path="/clusters/:name/edit" component={ClusterForm} />
          <Route exact path="/" render={(props) => <Dashboard />} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    user: state.user,
    clusters: state.clusters
  };
}

export default connect(mapStateToProps)(Content);
