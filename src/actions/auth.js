import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";

import AuthService from "../service/auth.service";

export const login = (username, password) => (dispatch) => {
  return AuthService.login(username, password).then(
    (data) => {
      console.log(data)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.data.user },
      });
      return data.data
    },
    (error) => {
      console.log(error)
      const message = error.response;
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return error
    }
  );
};

export const logout = (userId) => (dispatch) => {
  AuthService.logout(userId);
  dispatch({
    type: LOGOUT,
  });
};
