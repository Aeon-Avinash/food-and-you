import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  header: {
    marginTop: 0,
    marginBottom: 0
  },
  main: {
    marginTop: theme.spacing(14),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",

    backgroundColor: "white"
  }
}));

const Layout = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header className={classes.header} />
      <Container maxWidth="xl">
        <main className={classes.main}>{props.children}</main>
      </Container>
      <Footer footerClassName={classes.footer} />
    </div>
  );
};

export default Layout;
