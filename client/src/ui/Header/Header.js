import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NavLink from "../NavLink/NavLink";
import Typography from "@material-ui/core/Typography";

import NavLinkGroup from "../NavLinkGroup/NavLinkGroup";
import Logo from "../foodAndYou_logo.png";

const useStyles = makeStyles(theme => ({
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
  navLinkGroup: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      justifyContent: "flex-end"
    }
  },
  sideDrawer: {
    width: "33%"
  },
  sideDrawerNavGroup: {
    width: "100%",
    marginTop: 30
  },
  menuButton: {
    marginLeft: theme.spacing(2)
  },
  navBrand: {
    paddingLeft: 5,
    paddingRight: 5,
    textDecoration: "none",
    outline: "none",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    paddingLeft: 0,
    paddingRight: 0
  }
}));

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  serviceType: state.appData.auth.serviceType
});

const Header = connect(mapStateToProps)(props => {
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const classes = useStyles();
  const { authenticated } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const toggleSideDrawer = event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerVisibility(!drawerVisibility);
  };

  console.log(drawerVisibility);
  return (
    <AppBar position="absolute" color="default" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
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
        <div>
          {!matches ? (
            drawerVisibility ? (
              <Drawer
                open={drawerVisibility}
                onClose={toggleSideDrawer}
                onClick={toggleSideDrawer}
                classes={{
                  paper: classes.sideDrawer
                }}
              >
                <div className={classes.sideDrawerNavGroup}></div>
                <NavLinkGroup
                  authenticated={authenticated}
                  onClick={toggleSideDrawer}
                  className={classes.navLinkGroup}
                  drawerVisibility={drawerVisibility}
                />
              </Drawer>
            ) : (
              <IconButton
                edge="end"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleSideDrawer}
              >
                <MenuIcon />
              </IconButton>
            )
          ) : (
            <NavLinkGroup
              authenticated={authenticated}
              className={classes.navLinkGroup}
            />
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
