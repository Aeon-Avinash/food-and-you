import {
  // -- --store user global settings
  GET_GLOBAL_SETTINGS,
  // -- --edit user global settings
  EDIT_GLOBAL_SETTINGS
} from "../../../../actions/actionTypes";

// import { updateObjProp, updateObjAddToArr } from "../../../utils/updateHelpers";
export const INIT_STATE = {
  units: "si", //default, options: si || imperial
  doNotDisturb: false, //default, options: false || true
  dataBackupSync: {
    lastSynced: undefined,
    syncFrequency: "day" // default, options: hour || day || week
  },
  unitsState: {
    si: { checked: true, value: "si" },
    imperial: { checked: false, value: "imperial" }
  },
  dNDState: {
    true: { checked: false, value: "true" },
    false: { checked: true, value: "false" }
  }
};

const globalSettingsReducer = (globalSettingsState = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_GLOBAL_SETTINGS:
      return { ...payload };
    case EDIT_GLOBAL_SETTINGS:
      return { ...globalSettingsState, ...payload };
    default:
      return globalSettingsState;
  }
};

export default globalSettingsReducer;
