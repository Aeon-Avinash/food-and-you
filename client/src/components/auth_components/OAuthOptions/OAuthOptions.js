import React, { Component } from "react";
import { connect } from "react-redux";
import { authActions } from "../../../store/actions";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  authLinks: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main
    },
    "&:active": {
      color: theme.palette.secondary.main
    }
  }
});

class OAuthOptions extends Component {
  state = {
    disabled: false
  };

  componentDidMount() {
    const { socket, provider } = this.props;
    // console.log({ provider, socket });
    socket.on(provider, data => {
      // const { token, serviceType, authType } = data;
      // console.log({ provider, token, serviceType, authType });
      this.setState({ disabled: false });
      this.popup && this.popup.close();
      this.props[`oAuth_${provider}`](data);
    });
  }

  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        if (this.state && this.state.disabled)
          this.setState({ disabled: false });
      }
    }, 1000);
  }

  openPopup = () => {
    const { socket, provider } = this.props;
    // console.log(socket);
    console.log("socket.id", socket.id);

    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}/user/oauth/${provider}Login?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
    );
  };

  oAuthHandler = e => {
    if (!this.state.disabled) {
      e.preventDefault();
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({ disabled: true });
    }
  };

  render() {
    const { classes, provider } = this.props;
    const { disabled } = this.state;
    return (
      <>
        <Button
          variant="text"
          color="primary"
          onClick={this.oAuthHandler.bind(this)}
          className={classes.authLinks}
          disabled={disabled}
        >
          Auth with {provider}
        </Button>
      </>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataPrimary: state.appState.primary.successData,
  errorMessagePrimary: state.appState.primary.errorMessage,

  passwordResetToken: state.appData.auth.passwordResetToken
});

const enhanced = compose(
  withStyles(styles),
  connect(mapStateToProps, {
    oAuth_google: authActions.oAuthGoogle,
    oAuth_github: authActions.oAuthGithub
  })
);

export default enhanced(OAuthOptions);
