import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { compose } from "redux";
import thunk from "redux-thunk";
import { storeINIT } from "./reducers";
import reducer from "./reducers";
import * as actionCreators from "../store/actions";
import {
  checkAndSyncLocalStorage,
  SyncLocalStorageWithActions
} from "../utils/localStorageHelpers";

//* Using custom Logger function as a redux middleware
const logger = ({ getState }) => next => action => {
  // let yesLog = !(
  //   action.type.split("_").includes("UI") ||
  //   action.type.split("_").includes("VISIBILITY")
  // );
  // yesLog && console.log("will dispatch", action);
  const returnValue = next(action);
  // yesLog && console.log("state after dispatch", getState());
  return returnValue;
};

let composeEnhancers = compose;
// composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
if (process.env.NODE_ENV !== "production") {
  composeEnhancers = composeWithDevTools({
    actionCreators,
    trace: true,
    traceLimit: 25
  });
}

const store = createStore(
  reducer,
  checkAndSyncLocalStorage(storeINIT),
  composeEnhancers(applyMiddleware(thunk, logger, SyncLocalStorageWithActions))
);

export default store;
