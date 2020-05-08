import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.user, action) {
  switch(action.type) {
  case types.LOAD_USER_SUCCESS:
    return action.user
  case types.LOAD_USER_FAILURE:
    return null
  case types.APPLICATION_LOGOUT_SUCCESS:
    return null
  default:
    return state
  }
}
