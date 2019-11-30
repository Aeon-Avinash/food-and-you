import axios from "axios";

const getAuth_FAY = axios.create({
  baseURL: `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}/user`,
  headers: {
    "Content-Type": "application/json"
  }
});

//? axios setup for requests to get authenticated - signup/login/oauth-google/oauth-github

getAuth_FAY.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
  }
);

getAuth_FAY.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      if (response.data && response.data.token) {
        window.localStorage.setItem("token", JSON.stringify(response.data));
      }
    }
    return response;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
    //? Important: return and reject: error.response
  }
);

export default getAuth_FAY;
