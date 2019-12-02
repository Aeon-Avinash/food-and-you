import {
  // Client App State modifying actions
  // -- -- set current app state
  SET_APP_STATE_PRIMARY,
  // -- -- confirmation Message
  CONFIRM_SUCCESS_PRIMARY,
  // -- -- error Message
  REPORT_ERROR_PRIMARY,
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
} from "./actionTypes.js";

import getAuth_FAY from "../../apis/getAuth_FAY";
import withJWTAuth_FAY from "../../apis/withJWTAuth_FAY";
import googleAuth_FAY from "../../apis/googleAuth_FAY";
import noAuth_FAY from "../../apis/noAuth_FAY";

export const oAuthGoogle = gData => async dispatch => {
  //? request to Food And You server to begin the google oAuth process
  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: OAUTH_GOOGLE
      }
    });
    // const authResponse = await getAuth_FAY.get("/oauth/googleLogin");
    // if (authResponse.status === 200) {
    const { token, serviceType, gDriveAccess, gCalendarAccess } = gData;
    dispatch({
      type: OAUTH_GOOGLE,
      payload: { token, serviceType, gDriveAccess, gCalendarAccess },
      persistInLocalStorage: true
    });
    dispatch({ type: CONFIRM_SUCCESS_PRIMARY });

    // //* Store authData with token in localStorage
    // }
  } catch (err) {
    console.log(err);
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${OAUTH_GOOGLE} - Error!`
      });
  }
};

export const oAuthGithub = ({
  token,
  serviceType,
  authType
}) => async dispatch => {
  //? request to Food And You server to begin the github oAuth process
  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: OAUTH_GITHUB
      }
    });

    dispatch({
      type: OAUTH_GITHUB,
      payload: { token, serviceType, authType },
      persistInLocalStorage: true
    });
    dispatch({ type: CONFIRM_SUCCESS_PRIMARY });

    // //* Store authData with token in localStorage
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${OAUTH_GITHUB} - Error!`
      });
    console.log(err);
  }
};

export const signupEmail = authFormData => async dispatch => {
  //? request to Food And You server to begin the email Auth process
  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: SIGNUP_EMAIL
      }
    });
    const authResponse = await getAuth_FAY.post("/signup", authFormData);

    if (authResponse.status === 201) {
      const { token, serviceType } = authResponse.data;
      dispatch({
        type: SIGNUP_EMAIL,
        payload: { token, serviceType },
        persistInLocalStorage: true
      });
      dispatch({ type: CONFIRM_SUCCESS_PRIMARY });

      //* Store authData with token in localStorage
    }
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${SIGNUP_EMAIL} - Error!`
      });
    console.log(err);
  }
};

export const loginEmail = authFormData => async dispatch => {
  //? request to Food And You server to begin the email Auth process
  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: LOGIN_EMAIL
      }
    });
    const authResponse = await getAuth_FAY.post("/login", authFormData);
    console.log(authResponse.status, authResponse.data);
    if (authResponse.status === 200) {
      const { token, serviceType } = authResponse.data;
      dispatch({
        type: LOGIN_EMAIL,
        payload: { token, serviceType },
        persistInLocalStorage: true
      });
      dispatch({ type: CONFIRM_SUCCESS_PRIMARY });

      //* Store authData with token in localStorage
    } else if (authResponse.status !== 200) {
      console.log(authResponse.status, authResponse.data);
    }
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${LOGIN_EMAIL} - Error!`
      });
    console.log(err);
  }
};

export const logout = () => async (dispatch, getState) => {
  //? request to Food And You server to begin the process of logging out from this client
  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: LOGOUT
      }
    });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    let authResponse = await selectedAuthService.post("/user/logout");

    console.log(authResponse.status, authResponse.data);
    if (authResponse.status === 200) {
      // const { token, serviceType } = authResponse.data;
      dispatch({
        type: LOGOUT,
        // payload: { token, serviceType },
        clearLocalStorage: true
        //? clearing local storage upon logout
      });
      dispatch({ type: CONFIRM_SUCCESS_PRIMARY });

      //* Store authData with token in localStorage
    } else if (authResponse.status !== 200) {
      console.log(authResponse.status, authResponse.data);
    }
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message || (err.data && err.data.message) || `${LOGOUT} - Error!`
      });
    console.log(err);
  }
};

export const logoutFromAll = () => async dispatch => {
  //? request to Food And You server to begin the process of logging out from all devices
  //? Clear LocalStorage from this device

  dispatch({ type: LOGOUT_ALL_DEVICES });
};

export const requestResetPassword = ({ email }) => async dispatch => {
  //? request to Food And You server to begin the password reset process

  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: REQUEST_RESET_PASSWORD
      }
    });

    const requestResponse = await noAuth_FAY.post(
      `/user/requestPasswordReset`,
      {
        email //? {email: email}
      }
    );
    if (requestResponse.status === 200) {
      const passwordResetToken =
        requestResponse.data && requestResponse.data.passwordResetToken;
      dispatch({
        type: REQUEST_RESET_PASSWORD,
        payload: {
          message: `password_reset_request_status for ${email}`,
          passwordResetToken
        },
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_PRIMARY
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${REQUEST_RESET_PASSWORD} - Error!`
      });
    console.log(err);
  }
};

export const passwordResetConfirm = ({
  email,
  password,
  confirmPassword,
  passwordResetToken
}) => async dispatch => {
  //? request to Food And You server to begin the password reset process

  try {
    dispatch({
      type: SET_APP_STATE_PRIMARY,
      payload: {
        event: PASSWORD_RESET_CONFIRM
      }
    });

    const resetResponse = await noAuth_FAY.post(`/user/passwordResetConfirm`, {
      email,
      password,
      passwordResetToken
    });
    if (resetResponse.status === 200) {
      const { token, serviceType } = resetResponse.data;
      dispatch({
        type: PASSWORD_RESET_CONFIRM,
        payload: {
          message: `your_password_has_been_updated`,
          token,
          serviceType
        },
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_PRIMARY
      });
      console.log(resetResponse.data);

      //* Store userData in localStorage
    }
  } catch (err) {
    err &&
      dispatch({
        type: REPORT_ERROR_PRIMARY,
        payload:
          err.message ||
          (err.data && err.data.message) ||
          `${PASSWORD_RESET_CONFIRM} - Error!`
      });
    console.log(err);
  }
};
