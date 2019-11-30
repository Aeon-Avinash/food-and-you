import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import NavLink from "../NavLink/NavLink";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  appBar: {
    maxHeight: "150px",
    width: "100%",
    marginTop: 0,
    padding: 10
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerNav: {
    width: "100%",
    marginTop: 0,
    padding: 10
  },
  activeNavLink: {
    color: theme.palette.secondary.main,
    textDecoration: "underline"
  },
  navLinkGroup: {},
  navLink: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5
  }
});

class Header extends Component {
  render() {
    const { classes, authenticated } = this.props;
    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap>
            Food &amp; You
          </Typography>
          <div className={classes.navLinkGroup}>
            {authenticated ? (
              <NavLink
                exact
                to="/user/dashboard"
                className={classes.navLink}
                activeClassName={classes.activeNavLink}
              >
                My Dashboard
              </NavLink>
            ) : (
              <NavLink
                exact
                to="/auth/guestAccess"
                className={classes.navLink}
                activeClassName={classes.activeNavLink}
              >
                Home
              </NavLink>
            )}
            {authenticated && (
              <NavLink
                // exact
                to="/tracker"
                className={classes.navLink}
                activeClassName={classes.activeNavLink}
              >
                Diet Tracker
              </NavLink>
            )}
            <NavLink
              // exact
              to="/nutrition"
              className={classes.navLink}
              activeClassName={classes.activeNavLink}
            >
              Get Nutrition
            </NavLink>
            <NavLink
              // exact
              to="/recipes"
              className={classes.navLink}
              activeClassName={classes.activeNavLink}
            >
              Get Recipes
            </NavLink>
            {authenticated && (
              <NavLink
                // exact
                to="/settings"
                className={classes.navLink}
                activeClassName={classes.activeNavLink}
              >
                App Settings
              </NavLink>
            )}
            {!authenticated && (
              <NavLink
                // exact
                to="/auth/authLanding"
                className={classes.navLink}
                activeClassName={classes.activeNavLink}
              >
                Sign In
              </NavLink>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  serviceType: state.appData.auth.serviceType
});

const enhance = compose(withStyles(styles), connect(mapStateToProps));

export default enhance(Header);
