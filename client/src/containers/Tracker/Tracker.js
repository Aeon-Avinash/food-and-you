import React, { Component } from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import SwipeableRoutes from "react-swipeable-routes";
import moment from "moment";
import {
  trackerActions,
  uiStateActions,
  nutritionActions
} from "../../store/actions";
import StartSelectTrackerForm from "../../components/tracker_components/StartSelectTrackerForm/StartSelectTrackerForm";
import TrackerPreferencesForm from "../../components/tracker_components/TrackerPreferencesForm/TrackerPreferencesForm";
import Timeline from "../../components/tracker_components/Timeline/Timeline";
import RecentActivity from "../../components/tracker_components/RecentActivity/RecentActivity";
import TabsForContainer from "../../ui/TabsForContainer/TabsForContainer";
import { resourceTypes } from "../../helperData/constants";

class Tracker extends Component {
  componentDidMount = () => {
    //* fetching initial userData from the server
    console.log({ allTrackers: this.props.allTrackers });
    if (this.props.authenticated && !this.props.allTrackers)
      this.props.getAllTrackers();
    if (
      this.props.authenticated &&
      this.props.lastUsedDefaultTracker &&
      !this.props.trackerData._id
    )
      this.props.getTracker(this.props.lastUsedDefaultTracker);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.lastUsedDefaultTracker !== this.props.lastUsedDefaultTracker &&
      this.props.lastUsedDefaultTracker &&
      !this.props.trackerData._id
    ) {
      this.props.getTracker(this.props.lastUsedDefaultTracker);
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
  }

  redirectToAddMealPlan = () => {
    if (!this.props.trackerData || !this.props.trackerData._id) {
      this.props.history.push("/tracker/startSelectTracker");
    } else {
      this.props.history.push("/tracker/timeline");
      this.props.setEntryModalState(resourceTypes.mealPlan);
      this.props.setTargetNewEntrySlot({
        action: "trackerMenu",
        start: new Date(moment(this.props.currentTimelineDate).add(1, "day")),
        end: new Date(
          moment(this.props.currentTimelineDate)
            .add(1, "day")
            .add(15, "minutes")
        )
      });
      this.props.setSelectedSnippetType("NEW");
      this.props.setEntryModalVisibility(true);
    }
  };

  redirectToAddDietEntry = () => {
    if (!this.props.trackerData || !this.props.trackerData._id) {
      this.props.history.push("/tracker/startSelectTracker");
    } else {
      this.props.history.push("/tracker/timeline");
      this.props.setEntryModalState(resourceTypes.dietEntry);
      this.props.setTargetNewEntrySlot({
        action: "trackerMenu",
        start: new Date(moment(this.props.currentTimelineDate)),
        end: new Date(moment(this.props.currentTimelineDate).add(15, "minutes"))
      });
      this.props.setSelectedSnippetType("NEW");
      this.props.setEntryModalVisibility(true);
    }
  };

  render() {
    const {
      match,
      history,
      authenticated,
      trackerData,
      allTrackers,
      lastUsedDefaultTracker,
      userMetaData,
      successDataTrackerSync,
      errorMessageTrackerSync
    } = this.props;

    //* Fixing Timeline Performance */
    //* Optimize React components performance with PureComponents & React.Memo */

    //* Responsive UI */
    //* Make all components change layout with mediaQueries */
    //* Make the tracker calendar suitable for mobile view */

    return (
      <div>
        <nav>
          <TabsForContainer currentLocation={history.location.pathname}>
            <Link to="/tracker/timeline">Tracker Timeline</Link>
            <Link to="/tracker/startSelectTracker">Start Select Tracker</Link>
            <Link to="/tracker/trackerPreferences">Tracker Preferences</Link>
            <button type="button" onClick={this.redirectToAddDietEntry}>
              Add Diet Entry
            </button>
            <button type="button" onClick={this.redirectToAddMealPlan}>
              Add Meal Plan
            </button>
            <Link to="/tracker/recentActivity">Recent Activity</Link>
          </TabsForContainer>
        </nav>

        {!authenticated ? (
          <Redirect to="/" />
        ) : (
          <Switch>
            <>
              <SwipeableRoutes replace>
                <Route
                  exact
                  path={`${match.url}/timeline`}
                  render={routeProps => {
                    return <Timeline {...routeProps} />;
                  }}
                />
                <Route
                  exact
                  path={`${match.url}/startSelectTracker`}
                  render={routeProps => (
                    <StartSelectTrackerForm
                      allTrackers={allTrackers}
                      lastUsedDefaultTracker={lastUsedDefaultTracker}
                      handleSelectTracker={this.props.getTracker}
                      handleStartNewTracker={this.props.createTracker}
                      successDataTrackerSync={successDataTrackerSync}
                      errorMessageTrackerSync={errorMessageTrackerSync}
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/trackerPreferences`}
                  render={routeProps => (
                    <TrackerPreferencesForm
                      trackerData={trackerData}
                      trackerPreferences={
                        trackerData && trackerData.preferences
                      }
                      updateTrackerPreferences={
                        this.props.editTrackerPreferences
                      }
                      successDataTrackerSync={successDataTrackerSync}
                      errorMessageTrackerSync={errorMessageTrackerSync}
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/recentActivity`}
                  render={routeProps => (
                    <RecentActivity
                      trackerData={trackerData}
                      allTrackers={allTrackers}
                      userMetaData={userMetaData}
                      setCurrentTimelineView={this.props.setCurrentTimelineView}
                      setCurrentTimelineDate={this.props.setCurrentTimelineDate}
                      redirectToAddDietEntry={this.redirectToAddDietEntry}
                      redirectToAddMealPlan={this.redirectToAddMealPlan}
                      {...routeProps}
                    />
                  )}
                />
              </SwipeableRoutes>
            </>
            <>
              {!allTrackers || allTrackers.length === 0 ? (
                <Redirect from="/tracker" to="/tracker/startSelectTracker" />
              ) : (
                <Redirect from="/tracker" to="/tracker/timeline" />
              )}
            </>
          </Switch>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataTrackerSync: state.appState.trackerSync.successData,
  errorMessageTrackerSync: state.appState.trackerSync.errorMessage,

  allTrackers: state.appData.tracker.allTrackers,
  lastUsedDefaultTracker: state.appData.tracker.lastUsedDefaultTracker,
  trackerData: state.appData.tracker.selectedTracker,

  currentTimelineView: state.appData.tracker.currentTimeline.viewKey,
  currentTimelineDate: state.appData.tracker.currentTimeline.displayDate,

  userMetaData: state.appData.userData.settings.metaData
});

const enhance = compose(
  withSnackbar,
  connect(mapStateToProps, {
    getNutrition: nutritionActions.getNutrition,
    saveNutritionQuery: nutritionActions.saveNutritionQuery,

    getAllTrackers: trackerActions.getAllTrackers,
    getTracker: trackerActions.getTracker,
    addEntryToTracker: trackerActions.addEntryToTracker,
    createTracker: trackerActions.createTracker,
    editTrackerPreferences: trackerActions.editTrackerPreferences,

    setCurrentTimelineView: trackerActions.setCurrentTimelineView,
    setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
    setTargetNewEntrySlot: trackerActions.setTargetNewEntrySlot,
    setSelectedSnippetType: trackerActions.setSelectedSnippetType,

    setEntryModalState: uiStateActions.setModalOneState,
    setEntryModalVisibility: uiStateActions.setModalOneVisibility
  })
);

export default enhance(Tracker);
