const defaults = {
  status: [401],
  statusCodes: [401]
};

function createAuthRefreshInterceptor(axios, refreshTokenCall, options = {}) {
  const id = axios.interceptors.response.use(
    res => res,
    error => {
      // Reject promise if the error status is not in options.ports or defaults.ports
      console.log(error);
      const statusCodes =
        options.hasOwnProperty("statusCodes") && options.statusCodes.length
          ? options.statusCodes
          : defaults.statusCodes;
      if (
        !error.response ||
        (error.response.status &&
          statusCodes.indexOf(+error.response.status) === -1)
      ) {
        return Promise.reject(error);
      }

      // Remove the interceptor to prevent a loop
      // in case token refresh also causes the 401
      axios.interceptors.response.eject(id);

      const refreshCall = refreshTokenCall(error);

      // Create interceptor that will bind all the others requests
      // until refreshTokenCall is resolved
      const requestQueueInterceptorId = axios.interceptors.request.use(
        request => refreshCall.then(() => request)
      );

      // When response code is 401 (Unauthorized), try to refresh the token.
      return refreshCall
        .then(accessToken => {
          console.log("accessToken", accessToken);
          axios.interceptors.request.eject(requestQueueInterceptorId);
          error.response.config.headers[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          error.response.config.headers["serviceType"] = "JWT";
          localStorage.setItem("tempFnUaccessToken", accessToken);
          setTimeout(() => {
            localStorage.clear("tempFnUaccessToken");
          }, 10000);
          return axios(error.response.config);
          // return Promise.resolve(accessToken);
        })
        .catch(error => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return Promise.reject(error);
        })
        .finally(() =>
          createAuthRefreshInterceptor(axios, refreshTokenCall, options)
        );
    }
  );
  return axios;
}
export default createAuthRefreshInterceptor;
