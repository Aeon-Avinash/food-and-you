import axios from "axios";
import { getNestedObjValue } from "../utils/updateObjHelpers";
import store from "../store";

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
    if (!token || !token.access_token) {
      const error = new Error("Access Token Missing for this Route!");
      throw error;
    }

    console.log({ token });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const googleAuth_FAY = axios.create({
  baseURL: `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}`
});

//? axios setup for authenticated 'only' routes with google

googleAuth_FAY.interceptors.request.use(
  config => {
    // console.log(config);

    config.headers["Authorization"] = `Bearer ${
      getTokenFromLocalStore() && getTokenFromLocalStore().access_token
        ? getTokenFromLocalStore().access_token
        : getTokenFromLocalStore()
    }`;
    config.headers["serviceType"] = "GOOGLE";

    return config;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
  }
);

googleAuth_FAY.interceptors.response.use(
  response => {
    //? If response is truthy, simply return
    return response;
  },
  error => {
    // const errorResponse = error.response;
    console.log(error);
    console.log(error.response);
    console.log("Google Auth failed, logging out user!");
    //* logout user form client, if google auth fails
    if (error) {
      setTimeout(() => {
        store.dispatch({
          type: "LOGOUT",
          clearLocalStorage: true
        });
      }, 5000);
    }
    return Promise.reject(error);
  }
);

export default googleAuth_FAY;
