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

class LoginEmailForm extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    this.setState({
      [(event.target && event.target.name) || event.name]:
        (event.target && event.target.value) || event.value
    });
  };

  requestLoginWithEmail = event => {
    event.preventDefault();
    this.props.handleLoginByEmail(this.state);
  };

  render() {
    const { classes, errorMessage } = this.props;
    const { email, password } = this.state;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Log into your Food &amp; You account
          </Typography>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.requestLoginWithEmail}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Login with your email
            </Typography>
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
                validators={["required"]}
                errorMessages={["this field is required"]}
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
              Log me in
            </Button>
            <nav className={classes.authOptions}>
              <Link to="/auth/emailSignup">Signup with Email</Link>
              <Link to="/auth/forgotPassword">Forgot Password?</Link>
              <Link to="/auth/guestAccess">Access as Guest</Link>
            </nav>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(LoginEmailForm);
