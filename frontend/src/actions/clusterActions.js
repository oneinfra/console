import * as types from './actionTypes';
import Api from '../api/api';

export function loadClusters() {
  return function(dispatch) {
    return Api.getAllClusters().then(clusters => {
      dispatch(loadClustersSuccess(clusters));
    }).catch(error => {
      dispatch(loadClustersFailure(error));
    })
  }
}

export function loadClustersSuccess(clusters) {
  return { type: types.LOAD_CLUSTERS_SUCCESS, clusters }
}

export function loadClustersFailure(error) {
  return { type: types.LOAD_CLUSTERS_FAILURE, error }
}

export function updateClusterJoinTokens(clusterName, joinTokens) {
  return function (dispatch) {
    return Api.updateClusterJoinTokens(clusterName, joinTokens).then(() => {
      dispatch(updateClusterJoinTokensSuccess(clusterName))
    }).catch(error => {
      dispatch(updateClusterJoinTokensFailure(error))
    })
  }
}

export function updateClusterJoinTokensSuccess(clusterName) {
  return { type: types.UPDATE_CLUSTER_JOIN_TOKENS_SUCCESS, clusterName }
}

export function updateClusterJoinTokensFailure(error) {
  return { type: types.UPDATE_CLUSTER_JOIN_TOKENS_FAILURE, error }
}
