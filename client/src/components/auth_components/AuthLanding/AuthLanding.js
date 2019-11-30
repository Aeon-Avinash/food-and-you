import React from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "../../../ui/Link/Link";
import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiNutrition,
  mdiChefHat,
  mdiCalendarClock,
  // mdiSettings,
  mdiCalendarHeart,
  mdiShaker,
  mdiPeanutOffOutline
} from "@mdi/js";
import OAuthOptions from "../OAuthOptions/OAuthOptions";
import backImg from "../../../helperData/arugula-crust-food-208537.jpg";

const useStyles = makeStyles(theme => ({
  backgroundPaper: {
    backgroundImage: `url(${backImg})`,
    backgroundColor: "transparent"
  },
  rootPaper: {
    paddingTop: 20,
    paddingBottom: 20,
    opacity: 0.65
  },
  buttonGroup: {
    width: "90%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    textAlign: "center"
  },
  subHeader: {
    textAlign: "center"
  },
  authTitle: {
    textAlign: "center",
    marginTop: 50
  },
  authOptions: {
    marginTop: 50,
    display: "flex",
    maxWidth: "50%",
    margin: "auto",
    justifyContent: "space-around"
  },
  authLinks: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main
    },
    "&:active": {
      color: theme.palette.secondary.main
    }
  },
  navLinksContainer: {
    marginTop: "28vh",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  navLink: {
    textDecoration: "none !important"
  },
  navLinkContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  navLinkText: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main
    }
  }
}));

const socket = io.connect(`${process.env.REACT_APP_FOOD_AND_YOU_SERVER_URL}/`);
socket.on("connect", () => {
  console.log("socket.id", socket.id);
});

const AuthLanding = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.backgroundPaper}>
      <Paper className={classes.rootPaper}>
        <Typography variant="h2" gutterBottom className={classes.header}>
          Food &amp; You
        </Typography>
        <Typography
          variant="subtitle2"
          gutterBottom
          className={classes.subHeader}
        >
          your perfect diet companion
        </Typography>
        <Typography variant="h4" gutterBottom className={classes.authTitle}>
          Sign into your Food &amp; You account
        </Typography>
        <nav className={classes.authOptions}>
          <Button>
            <Link to="/auth/emailLogin" className={classes.authLinks}>
              Auth with Email
            </Link>
          </Button>
          {/* <div className={classes.oAuthOptions}> */}
          <OAuthOptions socket={socket} provider={"google"} />
          <OAuthOptions socket={socket} provider={"github"} />
          {/* </div> */}
          <Button>
            <Link to="/auth/guestAccess" className={classes.authLinks}>
              Access as Guest
            </Link>
          </Button>
        </nav>

        <main>
          <Paper component="nav" className={classes.navLinksContainer}>
            <NavLink exact to="/nutrition" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiNutrition} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Get Nutrition
                </Typography>
              </div>
            </NavLink>
            <NavLink exact to="/recipes" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiChefHat} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Get Recipes
                </Typography>
              </div>
            </NavLink>
            <NavLink exact to="/tracker" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiCalendarClock} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Diet Tracker
                </Typography>
              </div>
            </NavLink>
            <NavLink exact to="/tracker" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiCalendarHeart} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Meal Planner
                </Typography>
              </div>
            </NavLink>
            <NavLink exact to="/settings" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiPeanutOffOutline} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Custom Restrictions
                </Typography>
              </div>
            </NavLink>
            <NavLink exact to="/settings" className={classes.navLink}>
              <div className={classes.navLinkContent}>
                <Icon path={mdiShaker} size={5} color="#888" />
                <Typography className={classes.navLinkText}>
                  Plan Ingredients
                </Typography>
              </div>
            </NavLink>
          </Paper>
        </main>
      </Paper>
    </Paper>
  );
};

export default AuthLanding;
