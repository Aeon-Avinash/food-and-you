import axios from "axios";

const spoon_API = axios.create({
  baseURL: "https://api.spoonacular.com",
  params: {
    apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY
  }
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded"
  // }
});

spoon_API.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
spoon_API.defaults.params.apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

//? axios setup for non authenticated routes

spoon_API.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error.response);
    return Promise.reject(error.response);
  }
);

export default spoon_API;
