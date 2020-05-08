import * as types from './actionTypes';
import Api from '../api/api';

export function loadComponents(clusterName) {
  return function(dispatch) {
    dispatch(loadComponentsStarted(clusterName));
    return Api.getClusterComponents(clusterName).then(components => {
      dispatch(loadComponentsSuccess(clusterName, components));
    }).catch(error => {
      dispatch(loadComponentsFailure(error));
    })
  }
}

export function loadComponentsStarted(clusterName) {
  return { type: types.LOAD_COMPONENTS_STARTED, clusterName }
}

export function loadComponentsSuccess(clusterName, components) {
  return { type: types.LOAD_COMPONENTS_SUCCESS, clusterName, components }
}

export function loadComponentsFailure(clusterName, error) {
  return { type: types.LOAD_COMPONENTS_FAILURE, clusterName, error }
}
