import React from "react";
// import { Link } from "react-router-dom";

const GithubOAuthFailure = ({ handleGithubOAuth }) => (
  <div>
    <h1>GithubOAuthFailure</h1>
    <button onClick={handleGithubOAuth}>OAuth By Github</button>
    {/* <Link to="/oAuthGithubFailure">Auth Failure with Github</Link> */}
  </div>
);

export default GithubOAuthFailure;
