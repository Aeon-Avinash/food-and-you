import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MDSpinner from "react-md-spinner";
import "./App.css";
// import Auth from "./containers/Auth/Auth";
// import User from "./containers/User/User";
// import Settings from "./containers/Settings/Settings";
// import Tracker from "./containers/Tracker/Tracker";
import Recipes from "./containers/Recipes/Recipes";
import Nutrition from "./containers/Nutrition/Nutrition";
import NotFound from "./components/NotFound/NotFound";
import Layout from "./ui/Layout/Layout";

const Auth = lazy(() => import("./containers/Auth/Auth"));
const User = lazy(() => import("./containers/User/User"));
const Tracker = lazy(() => import("./containers/Tracker/Tracker"));
const Settings = lazy(() => import("./containers/Settings/Settings"));

const useStyles = makeStyles(theme => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey"
    },
    appRoot: {
      margin: 0,
      padding: 0
    }
  },
  appRoot: {
    height: "100%",
    width: "100%",
    position: "relative"
  },
  spinner: {
    position: "absolute",
    bottom: "50%",
    left: "50%"
  }
}));

function App({ authenticated }) {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.appRoot}>
        <Switch>
          <Route path="/recipes" component={Recipes} />
          <Route path="/nutrition" component={Nutrition} />

          <Route
            path="/settings"
            render={routeProps =>
              authenticated ? (
                <Suspense
                  fallback={<MDSpinner size={50} className={classes.spinner} />}
                >
                  <Settings {...routeProps} />
                </Suspense>
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            path="/tracker"
            render={routeProps =>
              authenticated ? (
                <Suspense
                  fallback={<MDSpinner size={50} className={classes.spinner} />}
                >
                  <Tracker {...routeProps} />
                </Suspense>
              ) : (
                <Redirect to="/" />
              )
            }
          />

          {!authenticated ? (
            <>
              <Suspense
                fallback={<MDSpinner size={50} className={classes.spinner} />}
              >
                <Redirect from="/" to="/auth" component={Auth} />
                <Route path="/auth" component={Auth} />
              </Suspense>
            </>
          ) : (
            <>
              <Suspense
                fallback={<MDSpinner size={50} className={classes.spinner} />}
              >
                <Redirect from="/" to="/user" component={User} />
                <Route path="/user" component={User} />
              </Suspense>
            </>
          )}
          <Route path="/" component={NotFound} />
        </Switch>
      </div>
    </Layout>
  );
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  serviceType: state.appData.auth.serviceType
});

export default connect(mapStateToProps)(App);
