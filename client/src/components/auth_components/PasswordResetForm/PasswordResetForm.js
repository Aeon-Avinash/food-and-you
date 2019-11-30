import React, { Component } from "react";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Link from "../../../ui/Link/Link";
import { withRouter } from "react-router-dom";

const styles = theme => ({
  rootPaper: {
    marginTop: 20,
    marginBottom: 20,
    margin: "auto",
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "40%"
    }
  },
  inputForm: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // width: "100%"
  },
  inputGroup: {
    width: "90%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  formControl: {
    marginRight: 50
  },
  submitButton: {
    marginTop: 20,
    width: "50%"
  },
  authOptions: {
    marginTop: 50,
    display: "flex",
    width: "100%",
    justifyContent: "space-around"
  }
});

class PasswordResetForm extends Component {
  state = {
    password: "",
    confirmPassword: ""
  };

  componentDidMount = () => {
    ValidatorForm.addValidationRule("notIncludePassword", passwordValue => {
      if (
        passwordValue
          .trim()
          .toLowerCase()
          .includes("password")
      ) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule("isPasswordMatch", confirmPasswordValue => {
      if (confirmPasswordValue !== this.state.password) {
        return false;
      }
      return true;
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.successData !== this.props.successData &&
      this.props.successData
    ) {
      this.props.enqueueSnackbar(
        `Your password has been successfully updated.`,
        { variant: "success" }
      );
    }
  }

  handleChange = event => {
    this.setState({
      [(event.target && event.target.name) || event.name]:
        (event.target && event.target.value) || event.value
    });
  };

  requestResetPassword = event => {
    const passwordResetToken =
      this.props.match && this.props.match.params.passwordResetToken;
    event.preventDefault();
    this.props.handlePasswordResetConfirm({
      ...this.state,
      passwordResetToken
    });
  };

  render() {
    const { classes } = this.props;
    const { password, confirmPassword } = this.state;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Reset password of your Food &amp; You account
          </Typography>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.requestResetPassword}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Reset and confirm your new password
            </Typography>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="New Password"
                onChange={this.handleChange}
                name="password"
                type="password"
                value={password || ""}
                validators={[
                  "required",
                  "minStringLength:8",
                  "notIncludePassword"
                ]}
                errorMessages={[
                  "this field is required",
                  "password requires minimum length of 8 characters!",
                  "password must not include the string 'password'"
                ]}
              />
            </div>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Confirm Password"
                onChange={this.handleChange}
                name="confirmPassword"
                type="password"
                value={confirmPassword || ""}
                validators={["required", "isPasswordMatch"]}
                errorMessages={[
                  "this field is required",
                  "passwords do not match!"
                ]}
              />
            </div>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Reset My Password
            </Button>
            <nav className={classes.authOptions}>
              <Link to="/auth/emailLogin">Login with Email</Link>
              <Link to="/auth/emailSignup">Signup with Email</Link>
              <Link to="/auth/guestAccess">Access as Guest</Link>
            </nav>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

const enhanced = compose(withSnackbar, withRouter, withStyles(styles));

export default enhanced(PasswordResetForm);
