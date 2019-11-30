import axios from "axios";

const noAuth_FAY = axios.create({
  baseURL: `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}`
});

//? axios setup for non authenticated routes

noAuth_FAY.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
  }
);

noAuth_FAY.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
    //? Important: return and reject: error.response
  }
);

export default noAuth_FAY;
