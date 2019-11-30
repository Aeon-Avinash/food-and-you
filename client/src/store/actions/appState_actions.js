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
} from "./actionTypes.js";

export const clearAllAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_ALL,
  persistInLocalStorage: true
});

export const setPrimaryAppState = ({ event, successData, errorMessage }) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_PRIMARY,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessPrimary = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_PRIMARY,
  payload: "Success Confirm"
});

export const reportErrorPrimary = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_PRIMARY,
  payload: "Error Report"
});

export const clearPrimaryAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_PRIMARY,
  persistInLocalStorage: true
});

export const setSecondaryAppState = ({ event, successData, errorMessage }) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SECONDARY,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessSecondary = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SECONDARY,
  payload: "Success Confirm"
});

export const reportErrorSecondary = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SECONDARY,
  payload: "Error Report"
});

export const clearSecondaryAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SECONDARY,
  persistInLocalStorage: true
});

export const setServerSyncAppState = ({
  event,
  successData,
  errorMessage
}) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SERVER_SYNC,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessServerSync = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SERVER_SYNC,
  payload: "Success Confirm"
});

export const reportErrorServerSync = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SERVER_SYNC,
  payload: "Error Report"
});

export const clearServerSyncAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SERVER_SYNC,
  persistInLocalStorage: true
});

export const setSyncNutritionAppState = ({
  event,
  successData,
  errorMessage
}) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SYNC_NUTRITION,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessSyncNutrition = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SYNC_NUTRITION,
  payload: "Success Confirm"
});

export const reportErrorSyncNutrition = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SYNC_NUTRITION,
  payload: "Error Report"
});

export const clearSyncNutritionAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SYNC_NUTRITION,
  persistInLocalStorage: true
});

export const setSyncRecipesAppState = ({
  event,
  successData,
  errorMessage
}) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SYNC_RECIPES,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessSyncRecipes = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SYNC_RECIPES,
  payload: "Success Confirm"
});

export const reportErrorSyncRecipes = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SYNC_RECIPES,
  payload: "Error Report"
});

export const clearSyncRecipesAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SYNC_RECIPES,
  persistInLocalStorage: true
});

export const setSyncSettingsAppState = ({
  event,
  successData,
  errorMessage
}) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SYNC_SETTINGS,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessSyncSettings = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SYNC_SETTINGS,
  payload: "Success Confirm"
});

export const reportErrorSyncSettings = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SYNC_SETTINGS,
  payload: "Error Report"
});

export const clearSyncSettingsAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SYNC_SETTINGS,
  persistInLocalStorage: true
});

export const setSyncTrackerAppState = ({
  event,
  successData,
  errorMessage
}) => ({
  //? request to update App State in the Food And You client

  type: SET_APP_STATE_SYNC_TRACKER,
  payload: {
    event,
    successData,
    errorMessage
  }
});

export const confirmSuccessSyncTracker = () => ({
  //? get specific success confirmation and display suitable message

  type: CONFIRM_SUCCESS_SYNC_TRACKER,
  payload: "Success Confirm"
});

export const reportErrorSyncTracker = () => ({
  //? get specific error report and display suitable message

  type: REPORT_ERROR_SYNC_TRACKER,
  payload: "Error Report"
});

export const clearSyncTrackerAppState = () => ({
  //? request to clear App State in the Food And You client

  type: CLEAR_APP_STATE_SYNC_TRACKER,
  persistInLocalStorage: true
});
