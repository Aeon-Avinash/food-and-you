import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Link from "../../../ui/Link/Link";

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
  },
  authErrorMessage: {
    textAlign: "center",
    color: "red"
  }
});

class SignupEmailForm extends Component {
  state = {
    username: "",
    email: "",
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

  handleChange = event => {
    this.setState({
      [(event.target && event.target.name) || event.name]:
        (event.target && event.target.value) || event.value
    });
  };

  requestSignupWithEmail = event => {
    event.preventDefault();
    this.props.handleSignupByEmail(this.state);
  };

  render() {
    const { classes, errorMessage } = this.props;
    const { username, email, password, confirmPassword } = this.state;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Signup to create a Food &amp; You account
          </Typography>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.requestSignupWithEmail}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Signup with your email
            </Typography>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Username"
                onChange={this.handleChange}
                name="username"
                value={username || ""}
                validators={["required", "maxStringLength:50"]}
                errorMessages={[
                  "this field is required",
                  "maximum string length of exceeded!"
                ]}
              />
            </div>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Email"
                onChange={this.handleChange}
                name="email"
                value={email || ""}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
            </div>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Password"
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
            <Typography
              variant="subtitle2"
              className={classes.authErrorMessage}
              gutterBottom
            >
              {errorMessage}
            </Typography>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Sign me up
            </Button>
            <nav className={classes.authOptions}>
              <Link to="/auth/emailLogin">Login with Email</Link>
              <Link to="/auth/forgotPassword">Forgot Password?</Link>
              <Link to="/auth/guestAccess">Access as Guest</Link>
            </nav>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SignupEmailForm);
