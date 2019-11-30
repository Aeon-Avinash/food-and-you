import React from "react";
// import { Link } from "react-router-dom";

const GoogleOAuthFailure = ({ handleGoogleOAuth }) => (
  <div>
    <h1>GoogleOAuthFailure</h1>
    <button onClick={handleGoogleOAuth}>OAuth By Google</button>
    {/* <Link to="/oAuthGoogleFailure">Auth Failure with Google</Link> */}
  </div>
);

export default GoogleOAuthFailure;
