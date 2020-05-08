import * as types from './actionTypes';

import { loadClusters } from './clusterActions';

export function initializeApplication() {
  return function(dispatch) {
    dispatch(initializeApplicationSuccess());
    dispatch(loadClusters());
  }
}

export function initializeApplicationSuccess() {
  return { type: types.APPLICATION_INITIALIZATION_SUCCESS }
}

export function logoutApplication() {
  return function(dispatch) {
    dispatch(logoutApplicationSuccess());
  }
}

export function logoutApplicationSuccess() {
  return { type: types.APPLICATION_LOGOUT_SUCCESS }
}
