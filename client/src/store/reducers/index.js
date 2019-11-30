import { combineReducers } from "redux";
import appData from "./appData_reducer";
import appState from "./appState_reducer";
import uiState from "./uiState_reducer";

import { INIT_STATE as appDataINIT } from "./appData_reducer";
import { INIT_STATE as appStateINIT } from "./appState_reducer";
import { INIT_STATE as uiStateINIT } from "./uiState_reducer";

export const storeINIT = {
  appData: appDataINIT,
  appState: appStateINIT,
  uiState: uiStateINIT
};

const reducer = combineReducers({
  appData,
  appState,
  uiState
});

export default reducer;
