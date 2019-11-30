import moment from "moment";
import {
  // Client App State modifying actions
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_TRACKER,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_TRACKER,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_TRACKER,
  // -- -- set current app state
  // SET_APP_STATE_PRIMARY,
  // -- -- confirmation Message
  // CONFIRM_SUCCESS_PRIMARY,
  // -- -- error Message
  // REPORT_ERROR_PRIMARY,
  // --tracker
  // -- --fetch all user trackers
  GET_ALL_TRACKERS,
  // -- --fetch tracker data
  GET_TRACKER,
  // -- --create new tracker
  CREATE_TRACKER,
  // -- --add new entry into tracker
  ADD_TRACKER_ENTRY,
  // -- --edit tracker entry
  EDIT_TRACKER_ENTRY,
  // -- --remove tracker entry
  REMOVE_TRACKER_ENTRY,
  // -- --set default tracker
  SET_DEFAULT_TRACKER,
  // -- --change timeline selection
  SET_CURRENT_TIMELINE_VIEW,
  // -- --change timeline display date
  SET_CURRENT_TIMELINE_DATE,
  // -- --set selected snippet Id
  SET_SELECTION_SNIPPET_ID,
  // -- --set selected snippet Type
  SET_SELECTION_SNIPPET_TYPE,
  // -- --set selected snippet Data
  SET_SELECTION_SNIPPET_DATA,
  // -- --set target timeline Date
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY,
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY,
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN,
  // -- --set target timeline Entry Slot
  SET_TARGET_ENTRY_SLOT,
  // -- --set target timeline Date
  SET_TARGET_TIMELINE_DATE,
  // -- --add the day's summary to the tracker
  ADD_TRACKER_DAY_SUMMARY,
  // // -- --add the week's summary to the tracker
  // ADD_TRACKER_WEEK_SUMMARY,
  // // -- --add the month's summary to the tracker
  // ADD_TRACKER_MONTH_SUMMARY,
  // -- --edit tracker preferences
  EDIT_TRACKER_PREFERENCES
} from "./actionTypes.js";

import withJWTAuth_FAY from "../../apis/withJWTAuth_FAY";
import googleAuth_FAY from "../../apis/googleAuth_FAY";
import { resourceTypes } from "../../helperData/constants.js";

export const setDefaultTracker = trackerId => async (dispatch, getState) => {
  //? request to add the recipe snippet to the users' 'saved' on the Food And You server
  //? update the 'recentSearches/recipes/userData' in the localStorage
  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: SET_DEFAULT_TRACKER
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

    const updateResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "lastUsedDefaultTracker",
        value: trackerId
      }
    );
    // let updateResponse = { status: 200 };

    if (updateResponse.status === 200) {
      dispatch({
        type: SET_DEFAULT_TRACKER,
        payload: trackerId,
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${SET_DEFAULT_TRACKER} - Error!`
    });
    console.log(err);
  }
};

export const getAllTrackers = () => async (dispatch, getState) => {
  //? check for the tracker with trackerId in localStorage
  //? request to fetch an user tracker from the Food And You server

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: GET_ALL_TRACKERS
      }
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

    const trackerResponse = await selectedAuthService.get(`/user/tracker`);
    if (trackerResponse.status === 200) {
      console.log(trackerResponse.data);
      const { allTrackersById, lastUsedDefaultTracker } = trackerResponse.data;
      dispatch({
        type: GET_ALL_TRACKERS,
        payload: { allTrackersById, lastUsedDefaultTracker },
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_ALL_TRACKERS} - Error!`
    });
    console.log(err);
  }
};

export const getTracker = trackerId => async (dispatch, getState) => {
  //? check for the tracker with trackerId in localStorage
  //? request to fetch an user tracker from the Food And You server

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: GET_TRACKER
      }
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

    const trackerResponse = await selectedAuthService.get(
      `/user/tracker/${trackerId}`
    );
    if (trackerResponse.status === 200) {
      console.log(trackerResponse.data);
      const tracker = trackerResponse.data && trackerResponse.data.tracker;
      //? fixing the Date object
      tracker.timelineSnippets.ENTRIES = tracker.timelineSnippets.ENTRIES.map(
        entry => {
          return {
            ...entry,
            start: new Date(moment(entry.start)),
            end: new Date(moment(entry.end))
          };
        }
      );
      tracker.timelineSnippets.DAYS = tracker.timelineSnippets.DAYS.map(day => {
        return {
          ...day,
          date: new Date(moment(day.date))
        };
      });

      dispatch({
        type: GET_TRACKER,
        payload: tracker,
        persistInLocalStorage: true
      });

      setDefaultTracker(tracker._id)(dispatch, getState);

      //* Also dispatch server update for lastUsedDefaultTracker:
      //* setLastUsedTracker(tracker._id) (POST request to update User profile)

      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER,
        persistInLocalStorage: true
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_TRACKER} - Error!`
    });
    console.log(err);
  }
};

export const createTracker = trackerPreferences => async (
  dispatch,
  getState
) => {
  //? request to fetch an user tracker from the Food And You server
  //? save the tracker with the trackerId in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: CREATE_TRACKER
      }
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

    console.log({ trackerPreferences });
    const trackerResponse = await selectedAuthService.post(`/user/tracker`, {
      trackerPreferences
    });
    if (trackerResponse.status === 200) {
      const { tracker } = trackerResponse.data;
      // const { allTrackersById } = trackerResponse.data;
      console.log({ tracker });
      dispatch({
        type: CREATE_TRACKER,
        payload: tracker,
        persistInLocalStorage: true
      });

      setDefaultTracker(tracker._id)(dispatch, getState);

      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER,
        persistInLocalStorage: true
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${CREATE_TRACKER} - Error!`
    });
    console.log(err);
  }
};

export const addEntryToTracker = (newEntry, callback) => async (
  dispatch,
  getState
) => {
  //? request to add an entry to the user tracker from the Food And You server
  //? update the tracker with the trackerId in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: ADD_TRACKER_ENTRY
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;
    let trackerId = getState().appData.tracker.selectedTracker._id;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
      //* adding entry to the gCalendar
      newEntry.googleCalendarEntry = {
        summary: `${newEntry.title} - ${newEntry.resourceId}`,
        description: `FoodAndYou ${newEntry.resourceId} - ${newEntry.ENERC_KCAL} Calories`,
        start: { dateTime: newEntry.start },
        end: { dateTime: newEntry.end },
        colorId: newEntry.resourceId === resourceTypes.mealPlan ? "8" : "9",
        //* add source.url & source.title linking back to the diet tracker webpage
        reminders: newEntry.resourceId === resourceTypes.mealPlan && {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 4 * 60 },
            { method: "popup", minutes: 15 }
          ]
        }
      };
    }

    const trackerResponse = await selectedAuthService.post(
      `/user/tracker/${trackerId}/entry`,
      { entry: newEntry }
    );
    if (trackerResponse.status === 200) {
      //   //* Also dispatch checks for the last updates of:
      //   //?  ADD_TRACKER_DAY_SUMMARY,
      //   //?   ADD_TRACKER_WEEK_SUMMARY,
      //   //?   ADD_TRACKER_MONTH_SUMMARY,

      const { entry, daySummary } = trackerResponse.data;

      const [selectedResourceDaySummary, otherResourceDaySummary] = daySummary;
      console.log({ selectedResourceDaySummary, otherResourceDaySummary });
      const dateFixed_Entry = {
        ...entry,
        start: new Date(moment(entry.start)),
        end: new Date(moment(entry.end))
      };
      const dateFixed_selectedResourceDaySummary = {
        ...selectedResourceDaySummary,
        date: new Date(moment(selectedResourceDaySummary.date))
      };
      const dateFixed_otherResourceDaySummary = {
        ...otherResourceDaySummary,
        date: new Date(moment(otherResourceDaySummary.date))
      };

      dispatch({
        type: ADD_TRACKER_ENTRY,
        payload: dateFixed_Entry,
        persistInLocalStorage: true
      });

      // //*  updating Day's Summary
      dispatch({
        type: ADD_TRACKER_DAY_SUMMARY,
        payload: {
          daySummary: [
            dateFixed_selectedResourceDaySummary,
            dateFixed_otherResourceDaySummary
          ]
        },
        persistInLocalStorage: true
      });

      if (entry && callback) {
        callback();
      }

      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${ADD_TRACKER_ENTRY} - Error!`
    });
    console.log(err);
  }
};

export const editTrackerEntry = updatedEntry => async (dispatch, getState) => {
  //? request to update an entry to the user tracker from the Food And You server
  //? update the tracker with the trackerId in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: EDIT_TRACKER_ENTRY
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;
    let trackerId = getState().appData.tracker.selectedTracker._id;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
      //* updating entry to the gCalendar
      updatedEntry.googleCalendarEntry = {
        summary: `${updatedEntry.title} - ${updatedEntry.resourceId}`,
        description: `FoodAndYou ${updatedEntry.resourceId} - ${updatedEntry.ENERC_KCAL} Calories`,
        start: { dateTime: updatedEntry.start },
        end: { dateTime: updatedEntry.end },
        colorId: updatedEntry.resourceId === resourceTypes.mealPlan ? "8" : "9",
        //* add source.url & source.title linking back to the diet tracker webpage
        reminders: updatedEntry.resourceId === resourceTypes.mealPlan && {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 4 * 60 },
            { method: "popup", minutes: 15 }
          ]
        }
      };
    }

    const trackerResponse = await selectedAuthService.patch(
      `/user/tracker/${trackerId}/entry/${updatedEntry._id}`,
      { entry: updatedEntry }
    );

    if (trackerResponse.status === 200) {
      //   //* Also dispatch checks for the last updates of:
      //   //?  ADD_TRACKER_DAY_SUMMARY,
      //   //?   ADD_TRACKER_WEEK_SUMMARY,
      //   //?   ADD_TRACKER_MONTH_SUMMARY,

      const { entry, daySummary } = trackerResponse.data;
      const [selectedResourceDaySummary, otherResourceDaySummary] = daySummary;
      console.log({ selectedResourceDaySummary, otherResourceDaySummary });
      const dateFixed_Entry = {
        ...entry,
        start: new Date(moment(entry.start)),
        end: new Date(moment(entry.end))
      };
      const dateFixed_selectedResourceDaySummary = {
        ...selectedResourceDaySummary,
        date: new Date(moment(selectedResourceDaySummary.date))
      };
      const dateFixed_otherResourceDaySummary = {
        ...otherResourceDaySummary,
        date: new Date(moment(otherResourceDaySummary.date))
      };

      dispatch({
        type: EDIT_TRACKER_ENTRY,
        payload: dateFixed_Entry,
        persistInLocalStorage: true
      });

      //*  updating Day's Summary
      dispatch({
        type: ADD_TRACKER_DAY_SUMMARY,
        payload: {
          daySummary: [
            dateFixed_selectedResourceDaySummary,
            dateFixed_otherResourceDaySummary
          ]
        },
        persistInLocalStorage: true
      });

      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${EDIT_TRACKER_ENTRY} - Error!`
    });
    console.log(err);
  }
};

export const removeTrackerEntry = entry => async (dispatch, getState) => {
  //? request to remove an entry to the user tracker from the Food And You server
  //? update the tracker with the trackerId in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: REMOVE_TRACKER_ENTRY
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;
    let trackerId = getState().appData.tracker.selectedTracker._id;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const trackerResponse = await selectedAuthService.delete(
      `/user/tracker/${trackerId}/entry/${entry._id}`
    );
    if (trackerResponse.status === 200) {
      //   //* Also dispatch checks for the last updates of:
      //   //?  ADD_TRACKER_DAY_SUMMARY,
      //   //?   ADD_TRACKER_WEEK_SUMMARY,
      //   //?   ADD_TRACKER_MONTH_SUMMARY,

      const { daySummary } = trackerResponse.data;
      const [selectedResourceDaySummary, otherResourceDaySummary] = daySummary;
      const dateFixed_selectedResourceDaySummary = {
        ...selectedResourceDaySummary,
        date: new Date(moment(selectedResourceDaySummary.date))
      };
      const dateFixed_otherResourceDaySummary = {
        ...otherResourceDaySummary,
        date: new Date(moment(otherResourceDaySummary.date))
      };

      dispatch({
        type: REMOVE_TRACKER_ENTRY,
        payload: entry,
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER
      });

      //*  updating Day's Summary
      dispatch({
        type: ADD_TRACKER_DAY_SUMMARY,
        payload: {
          daySummary: [
            dateFixed_selectedResourceDaySummary,
            dateFixed_otherResourceDaySummary
          ]
        },
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${REMOVE_TRACKER_ENTRY} - Error!`
    });
    console.log(err);
  }
};

export const editTrackerPreferences = preferences => async (
  dispatch,
  getState
) => {
  //? change the timeline View in the client
  //? save the new timelineSelection 'value' in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_TRACKER,
      payload: {
        event: EDIT_TRACKER_PREFERENCES
      }
    });

    let token = getState().appData.auth.token;
    let trackerId = getState().appData.tracker.selectedTracker._id;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const trackerResponse = await selectedAuthService.patch(
      `/user/tracker/${trackerId}/preferences`,
      { preferences: preferences }
    );

    if (trackerResponse.status === 200) {
      const { preferences } = trackerResponse.data;
      dispatch({
        type: EDIT_TRACKER_PREFERENCES,
        payload: preferences,
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_TRACKER
      });

      //* Store userData in localStorage
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_TRACKER,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${EDIT_TRACKER_PREFERENCES} - Error!`
    });
    console.log(err);
  }
};

export const setCurrentTimelineView = currentTimelineView => ({
  //? change the timeline View in the client
  //? save the new timelineViewKey 'value' in the localStorage

  type: SET_CURRENT_TIMELINE_VIEW,
  payload: currentTimelineView,
  persistInLocalStorage: true
});

export const setCurrentTimelineDate = currentTimelineDate => ({
  //? change the timeline Date in the client
  //? save the new timelineDate 'value' in the localStorage

  type: SET_CURRENT_TIMELINE_DATE,
  payload: currentTimelineDate,
  persistInLocalStorage: true
});

export const setTargetTimelineDate = targetTimelineDate => ({
  //? set the timeline view panel to the entry detail in the client

  type: SET_TARGET_TIMELINE_DATE,
  payload: targetTimelineDate,
  persistInLocalStorage: true
});

export const setSelectedSnippetId = selectedSnippetId => ({
  //? set the timeline entryview panel to the entry detail in the client

  type: SET_SELECTION_SNIPPET_ID,
  payload: selectedSnippetId,
  persistInLocalStorage: true
});

export const setSelectedSnippetType = selectedSnippetType => ({
  //? set the timeline entryview panel to the entry detail in the client

  type: SET_SELECTION_SNIPPET_TYPE,
  payload: selectedSnippetType,
  persistInLocalStorage: true
});

export const setSelectedSnippetData = selectedSnippetData => ({
  //? set the timeline entryview panel to the entry detail in the client

  type: SET_SELECTION_SNIPPET_DATA,
  payload: selectedSnippetData,
  persistInLocalStorage: true
});

export const setTargetNewEntrySlot = targetEntrySlots => ({
  //? set the time slots (initial selection) for the new entry to be added to the timeline

  type: SET_TARGET_ENTRY_SLOT,
  payload: targetEntrySlots,
  persistInLocalStorage: true
});

export const setConfirmTimeSlotSelectionTimelineEntry = confirmTimeSlotSelection => ({
  //? set the time slots (initial selection) for the new entry to be added to the timeline

  type: SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY,
  payload: confirmTimeSlotSelection
  // persistInLocalStorage: true
});

export const setConfirmTimeSlotSelectionDietEntry = confirmTimeSlotSelection => ({
  //? set the time slots (initial selection) for the new entry to be added to the timeline

  type: SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY,
  payload: confirmTimeSlotSelection
  // persistInLocalStorage: true
});

export const setConfirmTimeSlotSelectionMealPlan = confirmTimeSlotSelection => ({
  //? set the time slots (initial selection) for the new entry to be added to the timeline

  type: SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN,
  payload: confirmTimeSlotSelection
  // persistInLocalStorage: true
});
