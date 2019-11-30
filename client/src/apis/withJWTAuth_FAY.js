import axios from "axios";
// import createAuthRefreshInterceptor from "axios-auth-refresh";
import createAuthRefreshInterceptor from "./createAuthRefreshInterceptor";
import moment from "moment";
import { getNestedObjValue } from "../utils/updateObjHelpers";
import store from "../store";
// import noAuthFAY from "./noAuth_FAY";

const getTokenFromLocalStore = () => {
  try {
    let token;
    //? Approach 1: Fetching token from the redux store
    if (!token) token = store.getState().appData.auth.token;

    //? Approach 2: Fetching token from the localStorage for the axios instance
    if (!token) {
      const persistedData = window.localStorage.getItem("foodAndYou_App");
      const parsedData = persistedData && JSON.parse(persistedData);
      token =
        parsedData && getNestedObjValue(parsedData, "appData", "auth", "token");
    }

    //? Throw error back to the action for the missing token
    if (!token || !token.accessToken) {
      const error = new Error("Access Token Missing for this Route!");
      throw error;
    }

    console.log({ token });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const refreshAuthLogic = async failedRequest => {
  console.log({ failedRequest });

  const token = getTokenFromLocalStore();

  console.log(new Date(moment(token.refreshTokenExpiry)) > new Date());

  if (
    token &&
    token.refreshToken &&
    token.accessTokenExpiry &&
    new Date(moment(token.refreshTokenExpiry)) > new Date()
  ) {
    try {
      const tokenRefreshResponse = await axios.post(
        `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}/token`,
        {
          refreshToken: token.refreshToken
        }
      );

      if (tokenRefreshResponse && tokenRefreshResponse.data) {
        console.log(tokenRefreshResponse.data);
        const { token, serviceType } = tokenRefreshResponse.data;
        await store.dispatch({
          type: "LOGIN_EMAIL",
          payload: { token, serviceType },
          persistInLocalStorage: true
        });
        return Promise.resolve(token.accessToken);
      }
    } catch (err) {
      return Promise.reject(err.response || err);
    }
  } else {
    setTimeout(() => {
      store.dispatch({
        type: "LOGOUT",
        persistInLocalStorage: true
      });
    }, 5000);

    return Promise.reject({
      message: "Session expired! Please login again.",
      name: "refreshTokenExpiry",
      statusCode: 403
    });
  }
};

const withAuth_FAY = createAuthRefreshInterceptor(
  axios.create({
    baseURL: `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}`
  }),
  refreshAuthLogic,
  { statusCodes: [401, 403, 400], status: 401 }
);

//? axios setup for authenticated 'only' routes

withAuth_FAY.interceptors.request.use(
  config => {
    // console.log(config);
    //? setting up the header moved to the createInsterceptor config before being passed here
    //? a hacked up custom solution to prevent the old token from being resent
    if (!localStorage.getItem("tempFnUaccessToken")) {
      config.headers["Authorization"] = `Bearer ${
        getTokenFromLocalStore()
          ? getTokenFromLocalStore().accessToken
          : getTokenFromLocalStore()
      }`;
      config.headers["serviceType"] = "JWT";
    }

    return config;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
  }
);

withAuth_FAY.interceptors.response.use(
  response => {
    //? If response is truthy, simply return
    return response;
  },
  error => {
    // const errorResponse = error.response;
    console.log(error);
    console.log(error.response);
    return Promise.reject(error);
  }
);

export default withAuth_FAY;
