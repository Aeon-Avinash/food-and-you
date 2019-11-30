import {
  // Client App State modifying actions
  // -- -- set current app state
  SET_APP_STATE_SYNC_SETTINGS,
  // -- -- confirmation Message
  CONFIRM_SUCCESS_SYNC_SETTINGS,
  // -- -- error Message
  REPORT_ERROR_SYNC_SETTINGS,
  // -- --fetch preferences
  GET_USER_SETTINGS,
  EDIT_USER_SETTINGS,
  // -- --store user meta data
  GET_USER_META,
  // -- --edit user meta data
  EDIT_USER_META,
  // -- --store user preferences
  GET_PREFERENCES,
  // -- --edit user preferences
  EDIT_PREFERENCES,
  // -- --store user global settings
  GET_GLOBAL_SETTINGS,
  // -- --edit user global settings
  EDIT_GLOBAL_SETTINGS,
  // -- --edit user saved recipes
  GET_USER_SAVED_RECIPES,
  // -- --edit user saved nutrition
  GET_USER_SAVED_NUTRITION
} from "./actionTypes.js";

import withJWTAuth_FAY from "../../apis/withJWTAuth_FAY";
import googleAuth_FAY from "../../apis/googleAuth_FAY";

export const getUserSettings = () => async (dispatch, getState) => {
  //? check for userSettings in localStorage
  //? request to fetch user settings from the Food And You server

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_SETTINGS,
      payload: {
        event: GET_USER_SETTINGS
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const settingsResponse = await selectedAuthService.get(`/user/getProfile`);

    if (settingsResponse.status === 200) {
      if (settingsResponse.data && settingsResponse.data.user.settings) {
        const { user } = settingsResponse.data;
        console.log(user);
        const { recipes, nutrition, settings } = user;
        const { metaData, globalSettings, preferences } = settings;
        dispatch({
          type: GET_USER_SAVED_RECIPES,
          payload: recipes.saved,
          persistInLocalStorage: true
        });
        dispatch({
          type: GET_USER_SAVED_NUTRITION,
          payload: nutrition.saved,
          persistInLocalStorage: true
        });
        dispatch({
          type: GET_USER_META,
          payload: metaData,
          persistInLocalStorage: true
        });
        dispatch({
          type: GET_GLOBAL_SETTINGS,
          payload: globalSettings,
          persistInLocalStorage: true
        });
        dispatch({
          type: GET_PREFERENCES,
          payload: preferences,
          persistInLocalStorage: true
        });
        dispatch({
          type: CONFIRM_SUCCESS_SYNC_SETTINGS,
          persistInLocalStorage: true
        });
      }
      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_SETTINGS,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_USER_SETTINGS} - Error!`
    });
    console.log(err);
  }
};

export const setUserSettings = userSettingUpdates => async (
  dispatch,
  getState
) => {
  //? request to update user settings in the Food And You server
  //? update userSettings in localStorage as well

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_SETTINGS,
      payload: {
        event: EDIT_USER_SETTINGS
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    console.log(userSettingUpdates);

    const updateKey = Object.keys(userSettingUpdates)[0];

    const settingsResponse = await selectedAuthService.patch(
      `/user/updateProfile`,
      {
        updateCategory: "settings",
        updateKeyPath: updateKey,
        value: userSettingUpdates[updateKey]
      }
    );
    // let settingsResponse = { status: 200, data: userSettingUpdates };

    if (settingsResponse.status === 200) {
      console.log(settingsResponse.data.user.settings);
      const { metaData, globalSettings, preferences } =
        settingsResponse.data &&
        settingsResponse.data.user &&
        settingsResponse.data.user.settings;
      if (userSettingUpdates.metaData)
        dispatch({
          type: EDIT_USER_META,
          payload: metaData,
          persistInLocalStorage: true
        });
      if (userSettingUpdates.globalSettings)
        dispatch({
          type: EDIT_GLOBAL_SETTINGS,
          payload: globalSettings,
          persistInLocalStorage: true
        });
      if (userSettingUpdates.preferences)
        dispatch({
          type: EDIT_PREFERENCES,
          payload: preferences,
          persistInLocalStorage: true
        });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_SETTINGS,
        persistInLocalStorage: true
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_SETTINGS,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${EDIT_USER_SETTINGS} - Error!`
    });
    console.log(err);
  }
};
