import React, { Component } from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import SwipeableRoutes from "react-swipeable-routes";
import { settingsActions } from "../../store/actions";

import MetaData from "../../components/settings_components/MetaData/MetaData";
import Preferences from "../../components/settings_components/Preferences/Preferences";
import GlobalSettings from "../../components/settings_components/GlobalSettings/GlobalSettings";
import TabsForContainer from "../../ui/TabsForContainer/TabsForContainer";

class UserSettings extends Component {
  componentDidMount() {
    if (!this.props.userSettings) {
      this.props.getUserSettings();
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.errorMessageSettingsSync !==
        this.props.errorMessageSettingsSync &&
      this.props.errorMessageSettingsSync
    ) {
      this.props.enqueueSnackbar(this.props.errorMessageSettingsSync, {
        variant: "error"
      });
    }
    if (
      prevProps.successDataSettingsSync !==
        this.props.successDataSettingsSync &&
      this.props.successDataSettingsSync
    ) {
      this.props.enqueueSnackbar("Your settings have been updated.", {
        variant: "success"
      });
    }
  };

  setUserSettingsHandler = updateKeyVal => {
    this.props.setUserSettings({ ...updateKeyVal });
  };
  resetPasswordHandler = () => {
    this.props.resetPassword();
  };

  render() {
    const {
      match,
      history,
      // location,
      authenticated,
      errorMessageSettingsSync,
      userSettings
    } = this.props;

    return (
      <div>
        <nav>
          <TabsForContainer currentLocation={history.location.pathname}>
            <NavLink exact to="/settings/preferences">
              Diet Preferences
            </NavLink>
            <NavLink exact to="/settings/metaData">
              Meta Profile Data
            </NavLink>
            <NavLink exact to="/settings/globalSettings">
              Global Settings
            </NavLink>
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
                  path={`${match.url}/preferences`}
                  render={routeProps => (
                    <Preferences
                      errorMessage={errorMessageSettingsSync}
                      userSettings={userSettings.preferences}
                      handleSetUserSettings={this.setUserSettingsHandler}
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/metaData`}
                  render={routeProps => (
                    <MetaData
                      errorMessage={errorMessageSettingsSync}
                      userSettings={userSettings.metaData}
                      handleSetUserSettings={this.setUserSettingsHandler}
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/globalSettings`}
                  render={routeProps => (
                    <GlobalSettings
                      errorMessage={errorMessageSettingsSync}
                      userSettings={userSettings.globalSettings}
                      handleSetUserSettings={this.setUserSettingsHandler}
                      {...routeProps}
                    />
                  )}
                />
              </SwipeableRoutes>
            </>
            <>
              <Redirect exact from="/settings" to="/settings/preferences" />
            </>
          </Switch>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataSettingsSync: state.appState.settingsSync.successData,
  errorMessageSettingsSync: state.appState.settingsSync.errorMessage,
  userSettings: state.appData.userData.settings
});

const enhance = compose(
  withSnackbar,
  connect(mapStateToProps, {
    getUserSettings: settingsActions.getUserSettings,
    setUserSettings: settingsActions.setUserSettings,
    resetPassword: settingsActions.resetPassword
  })
);

export default enhance(UserSettings);
