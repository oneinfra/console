import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function initializedReducer(state = initialState.initialized, action) {
  switch(action.type) {
  case types.APPLICATION_INITIALIZATION_SUCCESS:
    return true
  case types.APPLICATION_LOGOUT_SUCCESS:
    return false
  case types.APPLICATION_EXTERNAL_LOGIN_STARTED:
    return false
  default:
    return state
  }
}
