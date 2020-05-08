import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function clusterComponentsReducer(state = initialState.components, action) {
  switch(action.type) {
  case types.LOAD_COMPONENTS_SUCCESS:
    return {
      ...state,
      [action.clusterName]: action.components
    }
  case types.LOAD_COMPONENTS_FAILURE:
    return state
  case types.APPLICATION_LOGOUT_SUCCESS:
    return {}
  default:
    return state
  }
}
