import { updateObjProp, getNestedObjValue } from "./updateObjHelpers";
import moment from "moment";

export const storeDataInLocalStorage = (value, updateKeys) => {
  const persistedData = window.localStorage.getItem("foodAndYou_App");
  const parsedData = JSON.parse(persistedData);
  const updatedData = updateObjProp(parsedData, value, ...updateKeys);
  window.localStorage.setItem("foodAndYou_App", JSON.stringify(updatedData));
};

export const checkAndSyncLocalStorage = (initState, persistKeysArr) => {
  const persistedData = window.localStorage.getItem("foodAndYou_App");
  if (!persistedData) {
    return initState;
  }
  const parsedData = JSON.parse(persistedData);

  const entries = getNestedObjValue(
    parsedData,
    "appData",
    "tracker",
    "selectedTracker",
    "timelineSnippets",
    "ENTRIES"
  );

  const newEntries =
    entries &&
    entries.map(entry => {
      return {
        ...entry,
        start: new Date(moment(entry.start)),
        end: new Date(moment(entry.end))
      };
    });

  const dateObjCorrectedData = updateObjProp(
    parsedData,
    newEntries,
    "appData",
    "tracker",
    "selectedTracker",
    "timelineSnippets",
    "ENTRIES"
  );

  return dateObjCorrectedData;
};

export const SyncLocalStorageWithActions = ({ getState }) => next => action => {
  const returnValue = next(action);
  const state = getState();
  if (action.persistInLocalStorage) {
    window.localStorage.setItem("foodAndYou_App", JSON.stringify(state));
  }
  if (action.clearLocalStorage) {
    window.localStorage.removeItem("foodAndYou_App");
    window.localStorage.removeItem("token");
  }
  return returnValue;
};
