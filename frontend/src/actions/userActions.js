import * as types from './actionTypes';
import Api from '../api/api';

import { initializeApplication, logoutApplication } from './applicationActions';

export function applicationExternalLogin(url) {
  return function(dispatch) {
    return dispatch(
      { type: types.APPLICATION_EXTERNAL_LOGIN_STARTED, url }
    )
  }
}

export function loadUser() {
  return function(dispatch) {
    return Api.getUser().then(user => {
      dispatch(loadUserSuccess(user));
    }).catch(error => {
      dispatch(loadUserFailure(error));
    }).then(() => {
      dispatch(initializeApplication());
    })
  }
}

export function loadUserSuccess(user) {
  return { type: types.LOAD_USER_SUCCESS, user }
}

export function loadUserFailure(error) {
  return { type: types.LOAD_USER_FAILURE, error }
}

export function logoutUser() {
  return function(dispatch) {
    return Api.logoutUser().then(() => {
      dispatch(logoutApplication());
      dispatch(loadUser());
    })
  }
}
