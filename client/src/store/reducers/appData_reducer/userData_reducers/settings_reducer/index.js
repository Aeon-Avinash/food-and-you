import { combineReducers } from "redux";
import metaDataReducer from "./metaData_reducer";
import preferencesReducer from "./preferences_reducer";
import globalSettingsReducer from "./globalSettings_reducer";

import { INIT_STATE as metaDataINIT } from "./metaData_reducer";
import { INIT_STATE as preferencesINIT } from "./preferences_reducer";
import { INIT_STATE as globalSettingsINIT } from "./globalSettings_reducer";

export const INIT_STATE = {
  metaData: metaDataINIT,
  preferences: preferencesINIT,
  globalSettings: globalSettingsINIT
};

const settingsReducer = combineReducers({
  metaData: metaDataReducer,
  preferences: preferencesReducer,
  globalSettings: globalSettingsReducer
});

export default settingsReducer;
