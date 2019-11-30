import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Link from "../Link/Link";
import Typography from "@material-ui/core/Typography";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="http://localhost:3000/">
        Food &amp; You
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  footerContainer: {
    // padding: 10
  },
  footerTagline: {
    textAlign: "center"
  }
}));

const Footer = props => {
  const classes = useStyles();
  return (
    <footer className={props.footerClassName}>
      <Container className={classes.footerContainer} maxWidth="md">
        <Paper>
          <Typography
            variant="body1"
            color="inherit"
            className={classes.footerTagline}
            noWrap
          >
            Food &amp; You App - Your personal diet tracker and meal planner
          </Typography>
          <Copyright />
        </Paper>
      </Container>
    </footer>
  );
};

export default Footer;
