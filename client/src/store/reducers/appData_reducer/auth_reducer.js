import {
  // --auth
  // -- --oAuth with Google
  OAUTH_GOOGLE,
  // -- --oAuth with Github
  OAUTH_GITHUB,
  // -- --signup with Username, Email, Password
  SIGNUP_EMAIL,
  // -- --login with Email, Password
  LOGIN_EMAIL,
  // --user profile
  // -- --logout
  LOGOUT,
  // -- --logout from all devices
  LOGOUT_ALL_DEVICES,
  // -- --request to change password
  REQUEST_RESET_PASSWORD,
  // -- --update with new password
  PASSWORD_RESET_CONFIRM
} from "../../actions/actionTypes";

import { updateObjProp } from "../../../utils/updateObjHelpers";

export const INIT_STATE = {
  token: undefined,
  // token: "somejsonwebtoken",
  authType: undefined,
  serviceType: undefined,
  gDriveAccess: false,
  gCalendarAccess: false,
  passwordResetToken: undefined
};

const authReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case OAUTH_GOOGLE:
      return {
        ...payload,
        token: payload.token,
        serviceType: payload.serviceType,
        authType: "Google"
      };
    case OAUTH_GITHUB:
      return {
        ...payload,
        token: payload.token,
        serviceType: payload.serviceType,
        authType: "Github"
      };
    case SIGNUP_EMAIL:
    case LOGIN_EMAIL:
      return {
        ...state,
        token: payload.token,
        serviceType: payload.serviceType,
        authType: "Email"
      };
    case LOGOUT:
      return INIT_STATE;
    case LOGOUT_ALL_DEVICES:
      return INIT_STATE;
    case REQUEST_RESET_PASSWORD:
      return updateObjProp(
        state,
        payload.passwordResetToken,
        "passwordResetToken"
      );
    case PASSWORD_RESET_CONFIRM:
      return {
        ...state,
        token: payload.token,
        serviceType: payload.serviceType,
        passwordResetToken: undefined
      };
    default:
      return state;
  }
};

export default authReducer;

// export const oAuthGoogle = dispatch => () => {
//   //? request to Food And You server to begin the google oAuth process

//   dispatch({ type: OAUTH_GOOGLE, payload: { token: "token" } });
// };

// export const oAuthGithub = dispatch => () => {
//   //? request to Food And You server to begin the github oAuth process

//   dispatch({ type: OAUTH_GITHUB, payload: { token: "token" } });
// };

// export const authEmail = dispatch => authFormData => {
//   //? request to Food And You server to begin the email Auth process

//   dispatch({ type: AUTH_EMAIL, payload: { token: "token" } });
// };

// export const logout = dispatch => () => {
//   //? request to Food And You server to begin the process of logging out from this client

//   dispatch({ type: LOGOUT });
// };

// export const logoutFrom = dispatch => () => {
//   //? request to Food And You server to begin the process of logging out from all devices
//   //? Clear LocalStorage from this device

//   dispatch({ type: LOGOUT_ALL_DEVICES });
// };
