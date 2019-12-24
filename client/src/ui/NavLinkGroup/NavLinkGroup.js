import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NavLink from "../NavLink/NavLink";
import Typography from "@material-ui/core/Typography";
import Logo from "../foodAndYou_logo.png";

const useStyles = makeStyles(theme => ({
  activeNavLink: {
    color: theme.palette.secondary.main,
    textDecoration: "underline"
  },
  navLink: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    textDecoration: "none",
    outline: "none",
    [theme.breakpoints.up("md")]: {
      marginBottom: 0
    }
  },
  navBrand: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    textDecoration: "none",
    outline: "none",
    [theme.breakpoints.up("md")]: {
      marginBottom: 0
    }
  }
}));

const NavLinkGroup = props => {
  const classes = useStyles();
  const { authenticated, drawerVisibility } = props;
  return (
    <>
      {drawerVisibility ? (
        <Button>
          <NavLink
            exact
            to={authenticated ? "/user/dashboard" : "/auth/guestAccess"}
            className={classes.navBrand}
          >
            <Typography variant="h6" color="inherit" noWrap>
              {"Food"}
            </Typography>
            <div className={classes.logo} color="inherit">
              <img
                src={Logo}
                width={50}
                height={50}
                alt={"food-and-you-logo"}
              />
            </div>
            <Typography variant="h6" color="inherit" noWrap>
              {"You"}
            </Typography>
          </NavLink>
        </Button>
      ) : null}

      {authenticated ? (
        <Button>
          <NavLink
            exact
            to="/user/dashboard"
            className={classes.navLink}
            activeClassName={classes.activeNavLink}
          >
            My Dashboard
          </NavLink>
        </Button>
      ) : (
        <Button>
          <NavLink
            exact
            to="/auth/guestAccess"
            className={classes.navLink}
            activeClassName={classes.activeNavLink}
          >
            Home
          </NavLink>
        </Button>
      )}
      {authenticated && (
        <Button>
          <NavLink
            // exact
            to="/tracker"
            className={classes.navLink}
            activeClassName={classes.activeNavLink}
          >
            Diet Tracker
          </NavLink>
        </Button>
      )}
      <Button>
        <NavLink
          // exact
          to="/nutrition"
          className={classes.navLink}
          activeClassName={classes.activeNavLink}
        >
          Get Nutrition
        </NavLink>
      </Button>
      <Button>
        <NavLink
          // exact
          to="/recipes"
          className={classes.navLink}
          activeClassName={classes.activeNavLink}
        >
          Get Recipes
        </NavLink>
      </Button>

      {authenticated && (
        <Button>
          <NavLink
            // exact
            to="/settings"
            className={classes.navLink}
            activeClassName={classes.activeNavLink}
          >
            App Settings
          </NavLink>
        </Button>
      )}
      {!authenticated && (
        <Button>
          <NavLink
            // exact
            to="/auth/authLanding"
            className={classes.navLink}
            activeClassName={classes.activeNavLink}
          >
            Sign In
          </NavLink>
        </Button>
      )}
    </>
  );
};

export default NavLinkGroup;
