import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { authActions } from "../../store/actions";
import SignupEmailForm from "../../components/auth_components/SignupEmailForm/SignupEmailForm";
import LoginEmailForm from "../../components/auth_components/LoginEmailForm/LoginEmailForm";
import GuestAccess from "../../components/auth_components/GuestAccess/GuestAccess";
import RequestPasswordReset from "../../components/auth_components/RequestPasswordReset/RequestPasswordReset";
import PasswordResetForm from "../../components/auth_components/PasswordResetForm/PasswordResetForm";
import GoogleOAuthFailure from "../../components/auth_components/GoogleOAuthFailure/GoogleOAuthFailure";
import GithubOAuthFailure from "../../components/auth_components/GithubOAuthFailure/GithubOAuthFailure";
import AuthLanding from "../../components/auth_components/AuthLanding/AuthLanding";

class Auth extends Component {
  render() {
    const {
      match,
      authenticated,
      errorMessagePrimary,
      successDataPrimary
    } = this.props;
    return (
      <div>
        {authenticated ? (
          <Redirect to="/user" />
        ) : (
          <Switch>
            <Route
              exact
              path={`${match.url}/authLanding`}
              render={routeProps => (
                <AuthLanding
                  // googleOAuthHandler={this.googleOAuthHandler}
                  // githubOAuthHandler={this.githubOAuthHandler}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/emailSignup`}
              render={routeProps => (
                <SignupEmailForm
                  errorMessage={errorMessagePrimary}
                  handleSignupByEmail={this.props.signupEmail}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/emailLogin`}
              render={routeProps => (
                <LoginEmailForm
                  errorMessage={errorMessagePrimary}
                  handleLoginByEmail={this.props.loginEmail}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/guestAccess`}
              // path="/guestAccess"
              render={routeProps => <GuestAccess {...routeProps} />}
            />
            <Route
              exact
              path={`${match.url}/forgotPassword`}
              render={routeProps => (
                <RequestPasswordReset
                  handleRequestResetPassword={this.props.requestResetPassword}
                  successData={successDataPrimary}
                  errorMessage={errorMessagePrimary}
                  //? only for test purposes token being passed to the request page
                  //? the passwordResetToken will be sent directly to the user via email
                  passwordResetToken={this.props.passwordResetToken}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/resetPassword/:passwordResetToken`}
              render={routeProps => (
                <PasswordResetForm
                  handlePasswordResetConfirm={this.props.passwordResetConfirm}
                  successData={successDataPrimary}
                  errorMessage={errorMessagePrimary}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/oAuthGoogleFailure`}
              render={routeProps => (
                <GoogleOAuthFailure
                  handleGoogleOAuth={this.props.oAuthGoogle}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/oAuthGithubFailure`}
              render={routeProps => (
                <GithubOAuthFailure
                  handleGithubOAuth={this.props.oAuthGithub}
                  {...routeProps}
                />
              )}
            />
            <Redirect from="/auth" to="/auth/authLanding" />
          </Switch>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataPrimary: state.appState.primary.successData,
  errorMessagePrimary: state.appState.primary.errorMessage,

  passwordResetToken: state.appData.auth.passwordResetToken
});

export default connect(mapStateToProps, {
  signupEmail: authActions.signupEmail,
  loginEmail: authActions.loginEmail,
  oAuthGoogle: authActions.oAuthGoogle,
  oAuthGithub: authActions.oAuthGithub,
  requestResetPassword: authActions.requestResetPassword,
  passwordResetConfirm: authActions.passwordResetConfirm
})(Auth);
