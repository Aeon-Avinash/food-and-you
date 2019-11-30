import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import {
  authActions,
  trackerActions,
  settingsActions,
  recipesActions,
  nutritionActions
} from "../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Settings from "../Settings/Settings";
import Tracker from "../Tracker/Tracker";
import Dashboard from "../../components/user_components/Dashboard/Dashboard";

const styles = theme => ({
  root: {
    position: "relative"
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20
  }
});

class User extends Component {
  componentDidMount() {
    //* fetching initial userData from the server
    // if (
    //   !this.props.settings.metaData ||
    //   Object.keys(this.props.settings.metaData).length === 0
    // ) {
    console.log("getting user settings");
    this.props.getUserSettings();
    // }
    //* fetching all trackers & default tracker from the server
    console.log({ allTrackers: this.props.allTrackers });
    if (this.props.authenticated && !this.props.allTrackers)
      this.props.getAllTrackers();
    if (
      this.props.authenticated &&
      this.props.lastUsedDefaultTracker &&
      !this.props.trackerData._id
    )
      this.props.getTracker(this.props.lastUsedDefaultTracker);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.lastUsedDefaultTracker !== this.props.lastUsedDefaultTracker &&
      this.props.lastUsedDefaultTracker &&
      !this.props.trackerData._id
    ) {
      this.props.getTracker(this.props.lastUsedDefaultTracker);
    }

    if (
      prevProps.settingsSyncErrorMessage !==
        this.props.settingsSyncErrorMessage &&
      this.props.settingsSyncErrorMessage
    ) {
      this.props.enqueueSnackbar(this.props.settingsSyncErrorMessage, {
        variant: "error"
      });
    }

    if (
      prevProps.errorMessageTrackerSync !==
        this.props.errorMessageTrackerSync &&
      this.props.errorMessageTrackerSync
    ) {
      this.props.enqueueSnackbar(this.props.errorMessageTrackerSync, {
        variant: "error"
      });
    }
  };

  logoutHandler = () => {
    this.props.logout();
  };

  render() {
    const {
      classes,
      match,
      authenticated,
      userMetaData,
      savedNutrition,
      savedRecipes,
      trackerData,
      allTrackers,
      trackerMetaInfo,
      trackerCalculations
    } = this.props;
    return (
      <div className={classes.root}>
        <Button onClick={this.logoutHandler} className={classes.logoutButton}>
          Logout
        </Button>
        {!authenticated ? (
          <Redirect to="/" />
        ) : (
          <Switch>
            <Route
              exact
              path={`${match.url}/dashboard`}
              render={routeProps => (
                <Dashboard
                  userMetaData={userMetaData}
                  savedNutrition={savedNutrition}
                  savedRecipes={savedRecipes}
                  trackerMetaInfo={trackerMetaInfo}
                  trackerCalculations={trackerCalculations}
                  trackerData={trackerData}
                  allTrackers={allTrackers}
                  setCurrentTimelineView={this.props.setCurrentTimelineView}
                  setCurrentTimelineDate={this.props.setCurrentTimelineDate}
                  getRecipeSearch={this.props.getRecipeSearch}
                  getRecipeDetail={this.props.getRecipeDetail}
                  getNutritionQuery={this.props.getNutritionQuery}
                  showNutritionAnalysis={this.props.showNutritionAnalysis}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/settings`}
              render={routeProps => <Settings {...routeProps} />}
            />
            <Route
              exact
              path={`${match.url}/tracker`}
              render={routeProps => <Tracker {...routeProps} />}
            />
            <Redirect from="/user" to="/user/dashboard" />
          </Switch>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  userMetaData: state.appData.userData.settings.metaData,
  settings: state.appData.userData.settings,

  settingsSyncErrorMessage: state.appState.settingsSync.errorMessage,
  errorMessageTrackerSync: state.appState.trackerSync.errorMessage,

  allTrackers: state.appData.tracker.allTrackers,
  trackerData: state.appData.tracker.selectedTracker,
  trackerMetaInfo: state.appData.tracker.selectedTracker.metaInfo,
  trackerCalculations: state.appData.tracker.selectedTracker.calculations,

  savedNutrition: state.appData.userData.nutrition.saved,
  savedRecipes: state.appData.userData.recipes.saved
});

const enhance = compose(
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, {
    logout: authActions.logout,
    getUserSettings: settingsActions.getUserSettings,

    getAllTrackers: trackerActions.getAllTrackers,
    getTracker: trackerActions.getTracker,
    setCurrentTimelineView: trackerActions.setCurrentTimelineView,
    setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
    getRecipeDetail: recipesActions.getRecipeDetail,
    getRecipeSearch: recipesActions.getRecipes,
    getNutritionQuery: nutritionActions.getNutrition,
    showNutritionAnalysis: nutritionActions.setShowNutritionDetail
  })
);

export default enhance(User);
