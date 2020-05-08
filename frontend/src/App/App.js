/*
Copyright 2020 Rafael Fernández López <ereslibre@ereslibre.es>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import './App.css';
import './Overrides.css';

import { withPolling } from '../lib/polling';

import { loadClusters } from '../actions/clusterActions';
import { loadKubernetesVersions } from '../actions/kubernetesVersionActions';

import Sidebar from './Sidebar';
import Content from './Content';

class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <Content />
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.loadKubernetesVersions();
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadKubernetesVersions: bindActionCreators(loadKubernetesVersions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(withPolling(loadClusters)(App));
