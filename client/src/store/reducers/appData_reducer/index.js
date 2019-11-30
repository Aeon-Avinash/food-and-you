import { combineReducers } from "redux";
import auth from "./auth_reducer";
import userData from "./userData_reducers";
import tracker from "./tracker_reducer";

import { INIT_STATE as authINIT } from "./auth_reducer";
import { INIT_STATE as userDataINIT } from "./userData_reducers";
import { INIT_STATE as trackerINIT } from "./tracker_reducer";

export const INIT_STATE = {
  auth: authINIT,
  tracker: trackerINIT,
  userData: userDataINIT
};

const appDataReducer = combineReducers({
  auth,
  userData,
  tracker
});

export default appDataReducer;
