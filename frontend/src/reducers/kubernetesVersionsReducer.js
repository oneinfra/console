import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function kubernetesVersionsReducer(state = initialState.kubernetesVersions, action) {
  switch(action.type) {
  case types.LOAD_KUBERNETES_VERSIONS_SUCCESS:
    return action.kubernetesVersions
  case types.LOAD_KUBERNETES_VERSIONS_FAILURE:
    return []
  default:
    return state
  }
}
