import * as types from './actionTypes';
import Api from '../api/api';

export function loadKubernetesVersions() {
  return function(dispatch) {
    return Api.getAllKubernetesVersions().then(kubernetesVersions => {
      dispatch(loadKubernetesVersionsSuccess(kubernetesVersions));
    }).catch(error => {
      dispatch(loadKubernetesVersionsFailure(error));
    })
  }
}

export function loadKubernetesVersionsSuccess(kubernetesVersions) {
  return { type: types.LOAD_KUBERNETES_VERSIONS_SUCCESS, kubernetesVersions }
}

export function loadKubernetesVersionsFailure(error) {
  return { type: types.LOAD_KUBERNETES_VERSIONS_FAILURE, error }
}
