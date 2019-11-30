import {
  // -- -- set primary app state
  SET_APP_STATE_PRIMARY,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_PRIMARY,
  // -- -- error Message for primary app state
  REPORT_ERROR_PRIMARY,
  // -- -- clear primary app state
  CLEAR_APP_STATE_PRIMARY,
  // -- -- set secondary app state
  SET_APP_STATE_SECONDARY,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SECONDARY,
  // -- -- error Message for secondary app state
  REPORT_ERROR_SECONDARY,
  // -- -- clear secondary app state
  CLEAR_APP_STATE_SECONDARY,
  // -- -- set server sync app state
  SET_APP_STATE_SERVER_SYNC,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SERVER_SYNC,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SERVER_SYNC,
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SERVER_SYNC,
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_NUTRITION,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_NUTRITION,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_NUTRITION,
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_NUTRITION,
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_RECIPES,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_RECIPES,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_RECIPES,
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_RECIPES,
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_SETTINGS,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_SETTINGS,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_SETTINGS,
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_SETTINGS,
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_TRACKER,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_TRACKER,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_TRACKER,
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_TRACKER,
  // -- -- clear all app state (primary, secondary & server sync)
  CLEAR_APP_STATE_ALL
} from "../actions/actionTypes";

import {
  updateObjProp
  // updateObjAddToArr,
  // updateObjRemoveFromArrByAccessor,
  // updateArrInObjAddOrReplaceByAccessor
} from "../../utils/updateObjHelpers";

export const INIT_STATE = {
  primary: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  secondary: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  serverSync: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  nutritionSync: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  recipesSync: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  settingsSync: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  },
  trackerSync: {
    event: undefined,
    successData: undefined,
    errorMessage: undefined,
    ON_SUCCESS_STATE_RESET_TIMEOUT: 30000
  }
};

const appStateReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_APP_STATE_PRIMARY:
      //* Re-setting the Primary AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.primary, event: payload },
        "primary"
      );
    case CONFIRM_SUCCESS_PRIMARY:
      return updateObjProp(
        state,
        payload ? payload : true,
        "primary",
        "successData"
      );
    case REPORT_ERROR_PRIMARY:
      return updateObjProp(
        state,
        payload ? payload : true,
        "primary",
        "errorMessage"
      );
    case CLEAR_APP_STATE_PRIMARY:
      return updateObjProp(state, INIT_STATE.primary, "primary");
    case SET_APP_STATE_SECONDARY:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.secondary, event: payload },
        "secondary"
      );
    case CONFIRM_SUCCESS_SECONDARY:
      return updateObjProp(
        state,
        payload ? payload : true,
        "secondary",
        "successData"
      );
    case REPORT_ERROR_SECONDARY:
      return updateObjProp(
        state,
        payload ? payload : true,
        "secondary",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SECONDARY:
      return updateObjProp(state, INIT_STATE.secondary, "secondary");
    case SET_APP_STATE_SERVER_SYNC:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.serverSync, event: payload },
        "serverSync"
      );
    case CONFIRM_SUCCESS_SERVER_SYNC:
      return updateObjProp(
        state,
        payload ? payload : true,
        "serverSync",
        "successData"
      );
    case REPORT_ERROR_SERVER_SYNC:
      return updateObjProp(
        state,
        payload ? payload : true,
        "serverSync",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SERVER_SYNC:
      return updateObjProp(state, INIT_STATE.serverSync, "serverSync");
    case SET_APP_STATE_SYNC_NUTRITION:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.nutritionSync, event: payload },
        "nutritionSync"
      );
    case CONFIRM_SUCCESS_SYNC_NUTRITION:
      return updateObjProp(
        state,
        payload ? payload : true,
        "nutritionSync",
        "successData"
      );
    case REPORT_ERROR_SYNC_NUTRITION:
      return updateObjProp(
        state,
        payload ? payload : true,
        "nutritionSync",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SYNC_NUTRITION:
      return updateObjProp(state, INIT_STATE.nutritionSync, "nutritionSync");
    case SET_APP_STATE_SYNC_RECIPES:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.recipesSync, event: payload },
        "recipesSync"
      );
    case CONFIRM_SUCCESS_SYNC_RECIPES:
      return updateObjProp(
        state,
        payload ? payload : true,
        "recipesSync",
        "successData"
      );
    case REPORT_ERROR_SYNC_RECIPES:
      return updateObjProp(
        state,
        payload ? payload : true,
        "recipesSync",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SYNC_RECIPES:
      return updateObjProp(state, INIT_STATE.recipesSync, "recipesSync");
    case SET_APP_STATE_SYNC_SETTINGS:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.settingsSync, event: payload },
        "settingsSync"
      );
    case CONFIRM_SUCCESS_SYNC_SETTINGS:
      return updateObjProp(
        state,
        payload ? payload : true,
        "settingsSync",
        "successData"
      );
    case REPORT_ERROR_SYNC_SETTINGS:
      return updateObjProp(
        state,
        payload ? payload : true,
        "settingsSync",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SYNC_SETTINGS:
      return updateObjProp(state, INIT_STATE.settingsSync, "settingsSync");
    case SET_APP_STATE_SYNC_TRACKER:
      //* Re-setting the Seconday AppState before adding new event
      return updateObjProp(
        state,
        { ...INIT_STATE.trackerSync, event: payload },
        "trackerSync"
      );
    case CONFIRM_SUCCESS_SYNC_TRACKER:
      return updateObjProp(
        state,
        payload ? payload : true,
        "trackerSync",
        "successData"
      );
    case REPORT_ERROR_SYNC_TRACKER:
      return updateObjProp(
        state,
        payload ? payload : true,
        "trackerSync",
        "errorMessage"
      );
    case CLEAR_APP_STATE_SYNC_TRACKER:
      return updateObjProp(state, INIT_STATE.trackerSync, "trackerSync");
    case CLEAR_APP_STATE_ALL:
      return INIT_STATE;
    default:
      return state;
  }
};

export default appStateReducer;
