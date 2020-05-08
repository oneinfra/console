import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function clustersReducer(state = initialState.clusters, action) {
  switch(action.type) {
  case types.LOAD_CLUSTERS_SUCCESS:
    return action.clusters
  case types.LOAD_CLUSTERS_FAILURE:
    return []
  case types.APPLICATION_LOGOUT_SUCCESS:
    return []
  default:
    return state
  }
}
